const options = document.querySelectorAll(".option");
const firstOption = options[0];
firstOption.classList.add("active");

options.forEach((option) => {
  option.addEventListener("mouseover", function () {
    options.forEach((option) => option.classList.remove("active"));
    this.classList.add("active");
  });

  option.addEventListener("mouseout", function () {
    options.forEach((option) => option.classList.remove("active"));
    firstOption.classList.add("active");
  });
});

// organisation chart

Highcharts.chart("chart-container", {
  chart: {
    height: 600,
    inverted: true,
  },
  title: {
    text: "Organizační struktura projektu Chytrá krajina 2030+",
    style: {
      fontFamily: "Dmsans Variable",
      display: "none",
    },
  },
  series: [
    {
      type: "organization",
      name: "Chytrá krajina 2030+",
      keys: ["from", "to"],
      data: [
        ["Chytrá krajina 2030+", "Administrativní tým"],
        ["Chytrá krajina 2030+", "Výzkumné týmy"],
        ["Chytrá krajina 2030+", "Průřezové aktivity"],
        ["Výzkumné týmy", "Regenerace krajiny"],
        ["Výzkumné týmy", "Chytré obce"],
        ["Výzkumné týmy", "Hydrologická bezpečnost"],
        ["Průřezové aktivity", "Demonstrační lokalita Chodov"],
        ["Průřezové aktivity", "Transfer technologií"],
        ["Průřezové aktivity", "Komunikace"],
      ],
      levels: [
        {
          level: 0,
          color: "#063719", // primary-900
          dataLabels: {
            color: "white",
          },
        },
        {
          level: 1,
          color: "#29652f", // primary-500
          dataLabels: {
            color: "white",
          },
        },
        {
          level: 2,
          color: "#71bf45", // primary-50
          dataLabels: {
            color: "#063719", // primary-900 for contrast on light background
          },
        },
      ],
      nodes: [
        {
          id: "Chytrá krajina 2030+",
          title: "Hlavní projekt",
        },
        {
          id: "Administrativní tým",
        },
        {
          id: "Výzkumné týmy",
        },
        {
          id: "Průřezové aktivity",
        },
        {
          id: "Regenerace krajiny",
        },
        {
          id: "Chytré obce",
        },
        {
          id: "Hydrologická bezpečnost",
        },
        {
          id: "Demonstrační lokalita Chodov",
        },
        {
          id: "Transfer technologií",
        },
        {
          id: "Komunikace",
        },
      ],
      colorByPoint: false,
      color: "#29652f", // primary-500
      dataLabels: {
        color: "white",
      },
      borderColor: "white",
      nodeWidth: 65,
      borderRadius: 12,
    },
  ],
  tooltip: {
    enabled: false,
    useHTML: true,
  },
  exporting: {
    enabled: false,
  },
}); // This closing brace ends the Highcharts.chart function

// init news tabs

const newsTabs = new Tabs('[data-tabs-component="news"]', {
  navSelector: '[data-tab="nav"]',
  contentSelector: '[data-tab="content"]',
  titleSelector: '[data-tab="title"]',
  activeClass: "active",
  contentActiveClass: "active-tab",
  updateURL: true,
});

// swiper slider for news

const newsSlider = new Swiper("[swiper-slider=news]", {
  slidesPerView: 1,
  spaceBetween: 20,
  navigation: {
    nextEl: "[swiper-button-next]",
    prevEl: "[swiper-button-prev]",
  },
  breakpoints: {
    640: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3.2,
    },
  },
});

const eventsSlider = new Swiper("[swiper-slider=events]", {
  slidesPerView: 1,
  spaceBetween: 20,
  navigation: {
    nextEl: "[swiper-button-next]",
    prevEl: "[swiper-button-prev]",
  },
  breakpoints: {
    640: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3.2,
    },
  },
});
