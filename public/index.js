
const form = document.querySelector("#find-laptop-form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const usecase = formData.get("usecase");
  const price = formData.get("price");
  const brand = formData.get("brand");
  const ram = formData.get("ram");
  const ramNumber = ram ? parseInt(ram) : undefined;
  const ssd = formData.get("ssd");
  const ssdNumber = ssd ? parseInt(ssd) : undefined;
  const custom = formData.get("custom")
  // console.log(ssd,brand,ram,custom);
  const requestData = {
    usecase,
    price,
    brand,
    ssd: ssdNumber,
    ram: ramNumber,
    custom
  };
  
  const response = await fetch("/find_laptop", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify( requestData),
  });
  if (response.ok) {
    const laptops = await response.json();
    const table = document.querySelector("#laptop-table");
    const tbody = table.querySelector("tbody");
    tbody.innerHTML = "";
    laptops.forEach((laptop) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${laptop.Brand.toUpperCase()} ${laptop.Model}</td>
        <td>${laptop.Cpuman} ${laptop.Cpu}</td>
        <td>${laptop.Ram} GB</td>
        <td>${
          laptop.SsdSize ? laptop.SsdSize + " GB SSD" : "1 TB HDD"
        }</td>
        <td>${laptop.Laptopsize} Inch</td>
        <td>${laptop.Gpu}</td>
        <td>${laptop.Price}*</td>
        <td>
          <a href="${laptop.Link}" target="_blank">Buy Now</a>
        </td>
        <td><button onclick="createPopup('${laptop._id}')">Send to Mail</button><td>
      `;
      tbody.appendChild(tr);
    });
    table.style.display = "table";
  } else {
    console.error(response.status);
  }
});
//send mail to email -----------------------------


function createPopup(laptop) {
  // Prompt the user for their name
  let email = prompt("Please Input Your Email to send you the Product:");
  console.log(laptop,email);
  
  function isValidEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  const isValid = isValidEmail();
  if (isValid) {
    const data = {
      emailid: email,
      laptop:laptop
    };
    fetch("/mailer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        alert("An Email will be sent to your Email.");
        // Handle the response from the server as needed
      })
      .catch((error) => {
        // Handle any errors that occur during the fetch request
      });
  } else {
    alert("Invalid Email. Please try again.");
  }
}


