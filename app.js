new Vue({
  el: "#app",

  data() {
    return {
      showCart: false,
      cart: [],
      sortBy: "subject",
      sortOrder: "asc",
      searchTerm: "",
      orderMessage: "",

      order: {
        name: "",
        phone: ""
      },

      // LESSONS LOADED FROM MONGODB
      lessons: []
    };
  },

  mounted() {
    this.fetchLessons();
  },

  computed: {
    // FILTER AND SORT LESSONS
    filteredLessons() {
      const term = this.searchTerm.toLowerCase();

      const filtered = this.lessons.filter((lesson) => {
        return (
          lesson.subject.toLowerCase().includes(term) ||
          lesson.location.toLowerCase().includes(term)
        );
      });

      return filtered.sort((a, b) => {
        let comparison = 0;

        if (a[this.sortBy] > b[this.sortBy]) comparison = 1;
        if (a[this.sortBy] < b[this.sortBy]) comparison = -1;

        return this.sortOrder === "asc"
          ? comparison
          : comparison * -1;
      });
    },

    // CALCULATE CART TOTAL
    cartTotal() {
      return this.cart.reduce(
        (total, item) => total + item.price,
        0
      );
    },

    // VALIDATE CUSTOMER NAME
    validName() {
      return /^[A-Za-z\s]+$/.test(this.order.name);
    },

    // VALIDATE CUSTOMER PHONE
    validPhone() {
      return /^[0-9]+$/.test(this.order.phone);
    },

    // CHECKOUT VALIDATION
    canCheckout() {
      return (
        this.validName &&
        this.validPhone &&
        this.cart.length > 0
      );
    }
  },

  methods: {
    // GET LESSONS FROM BACKEND
    fetchLessons() {
      fetch("http://localhost:3000/lessons")
        .then(response => {
          if (!response.ok) {
            throw new Error("Could not load lessons");
          }

          return response.json();
        })
        .then(data => {
          this.lessons = data.map(lesson => ({
            id: lesson._id,
            icon: lesson.icon,
            subject: lesson.topic,
            image: "http://localhost:3000/images/" + lesson.image,
            location: lesson.location,
            price: lesson.price,
            spaces: lesson.space,
            rating: lesson.rating
          }));
        })
        .catch(error => {
          console.log("Error loading lessons:", error);
        });
    },

    // ADD LESSON TO CART
    addToCart(lesson) {
      if (lesson.spaces > 0) {
        this.cart.push(lesson);
        lesson.spaces--;
      }
    },

    // REMOVE LESSON FROM CART
    removeFromCart(item) {
      const index = this.cart.indexOf(item);

      if (index > -1) {
        this.cart.splice(index, 1);
        item.spaces++;
      }
    },

    // SUBMIT ORDER TO MONGODB
    async submitOrder() {
      if (!this.canCheckout) return;

      // COUNT SELECTED SPACES FOR EACH LESSON
      const lessonCounts = {};

      this.cart.forEach(item => {
        lessonCounts[item.id] =
          (lessonCounts[item.id] || 0) + 1;
      });

      const lessonIDs = Object.keys(lessonCounts);

      const numberOfSpaces = lessonIDs.map(
        id => lessonCounts[id]
      );

      try {
        // POST ORDER
        const response = await fetch(
          "http://localhost:3000/orders",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json"
            },

            body: JSON.stringify({
              name: this.order.name,
              phone: this.order.phone,
              lessonIDs: lessonIDs,
              numberOfSpaces: numberOfSpaces
            })
          }
        );

        if (!response.ok) {
          throw new Error("Could not save order");
        }

        // PUT UPDATED LESSON SPACES
        const updates = lessonIDs.map(id => {
          const lesson = this.lessons.find(
            item => item.id === id
          );

          return fetch(
            "http://localhost:3000/lessons/" + id,
            {
              method: "PUT",

              headers: {
                "Content-Type": "application/json"
              },

              body: JSON.stringify({
                space: lesson.spaces
              })
            }
          );
        });

        const results = await Promise.all(updates);

        if (results.some(result => !result.ok)) {
          throw new Error(
            "Order saved, but lesson spaces could not all be updated"
          );
        }

        // DISPLAY SUCCESS MESSAGE
        this.orderMessage =
          "Thank you " + this.order.name +
          "! Your order has been submitted successfully.";

        // CLEAR CART AND CUSTOMER DETAILS
        this.cart = [];
        this.order = {
          name: "",
          phone: ""
        };

        this.showCart = false;

      } catch (error) {
        console.log("Order error:", error);

        this.orderMessage =
          "There was a problem submitting your order. Please try again.";
      }
    }
  }
});
