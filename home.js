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
