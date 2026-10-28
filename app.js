
new Vue({
  el: "#app",

  data() {
    return {
      showCart: false,
      cart: [],
      sortBy: "subject",
      sortOrder: "asc",
      searchTerm: "",

      // LESSONS INFORMATION
      lessons: [
        {
          id: 1,
          icon: "🤖",
          subject: "Robotics",
          image: "images/robotics.jpg",
          location: "Business Bay",
          price: 250,
          spaces: 5,
          rating: 5
        },
        {
          id: 2,
          icon: "💻",
          subject: "Coding",
          image: "images/coding.jpg",
          location: "Dubai Marina",
          price: 300,
          spaces: 5,
          rating: 4
        },
        {
          id: 3,
          icon: "🧠",
          subject: "Artificial Intelligence",
          image: "images/ai.jfif",
          location: "Downtown Dubai",
          price: 350,
          spaces: 5,
          rating: 5
        },
        {
          id: 4,
          icon: "📐",
          subject: "Mathematics",
          image: "images/math.jfif",
          location: "Jumeirah",
          price: 200,
          spaces: 5,
          rating: 4
        },
        {
          id: 5,
          icon: "🔬",
          subject: "Science",
          image: "images/science.jfif",
          location: "Al Barsha",
          price: 220,
          spaces: 5,
          rating: 4
        },
        {
          id: 6,
          icon: "📷",
          subject: "Photography",
          image: "images/photography.jpg",
          location: "Palm Jumeirah",
          price: 280,
          spaces: 5,
          rating: 3
        },
        {
          id: 7,
          icon: "⚽",
          subject: "Football",
          image: "images/football.jfif",
          location: "Dubai Hills",
          price: 180,
          spaces: 5,
          rating: 5
        },
        {
          id: 8,
          icon: "🏀",
          subject: "Basketball",
          image: "images/basketball.jpg",
          location: "Mirdif",
          price: 190,
          spaces: 5,
          rating: 3
        },
        {
          id: 9,
          icon: "🎨",
          subject: "Graphic Design",
          image: "images/design.jfif",
          location: "JLT",
          price: 320,
          spaces: 5,
          rating: 3
        },
        {
          id: 10,
          icon: "💼",
          subject: "Business Skills",
          image: "images/business.jpg",
          location: "Dubai Silicon Oasis",
          price: 400,
          spaces: 5,
          rating: 4
        }
      ]
    };
  },

  computed: {
    // SEARCH AND SORT LESSONS
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
    }
  },

  methods: {
    // ADD A LESSON TO THE CART
    addToCart(lesson) {
      if (lesson.spaces > 0) {
        this.cart.push(lesson);
        lesson.spaces--;
      }
    },

    // REMOVE A LESSON FROM THE CART
    removeFromCart(item) {
      const index = this.cart.indexOf(item);

      if (index > -1) {
        this.cart.splice(index, 1);
        item.spaces++;
      }
    }
  }
});
