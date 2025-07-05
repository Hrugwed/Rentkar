const taxSwitch = document.getElementById("taxSwitch");
    const priceTexts = document.querySelectorAll(".priceText");

    taxSwitch.addEventListener("change", () => {
      const taxRate = 0.18; // 18% tax

      priceTexts.forEach(span => {
        const basePrice = parseFloat(span.dataset.price); // ← important
        if (isNaN(basePrice)) {
          console.error("Invalid base price in span:", span);
          return;
        }

        const finalPrice = taxSwitch.checked
          ? basePrice * (1 + taxRate)
          : basePrice;

        span.textContent = Math.round(finalPrice).toLocaleString("en-IN");
      });
    });