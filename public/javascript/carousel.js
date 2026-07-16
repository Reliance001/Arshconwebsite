document.addEventListener("DOMContentLoaded", function () {
  const carousels = document.querySelectorAll(".project-carousel");

  carousels.forEach((carousel, index) => {
    const wrapper = carousel.querySelector(".swiper-wrapper");
    const slides = wrapper.querySelectorAll(".swiper-slide");
    const nextBtn = document.getElementById(`next-${index}`);
    const prevBtn = document.getElementById(`prev-${index}`);

    let currentIndex = 0;
    const totalSlides = slides.length;

    const update = () => {
      wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
    };

    nextBtn.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % totalSlides;
      update();
    });

    prevBtn.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      update();
    });

    setInterval(() => {
      currentIndex = (currentIndex + 1) % totalSlides;
      update();
    }, 5000);
  });
});
