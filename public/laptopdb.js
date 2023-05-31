
const form = document.querySelector("#find-laptop-form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const price = formData.get("price");
  const brand = formData.get("brand");
  const ram = formData.get("ram");
  const ramNumber = ram ? parseInt(ram) : undefined;
  const ssd = formData.get("ssd");
  const ssdNumber = ssd ? parseInt(ssd) : undefined;
  const custom = formData.get("custom")
  // console.log(ssd,brand,ram,custom);
  const requestData = {
    price,
    brand,
    ssd: ssdNumber,
    ram: ramNumber,
    custom
  };
  
  const response = await fetch("/all_laptop", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify( requestData),
  });
  if (response.ok) {
    const laptops = await response.json();
    const total = laptops.length;
    const totallaptop = document.querySelector("#totalap");
    totallaptop.innerHTML = "Total Laptops : "+total;
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
        <td><button onclick="deletelaptop('${laptop._id}')">Delete</button><td>
      `;
      tbody.appendChild(tr);
    });
    table.style.display = "table";
  } else {
    console.error(response.status);
  }
});

// ------------------------------------
async function findLaptops() {
    const form = document.querySelector("#find-laptop-form");
    const requestData = { /* some data to be sent with the request */ };
  
    try {
      const response = await fetch("/all_laptop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
  
      if (response.ok) {
        const laptops = await response.json();
        const total = laptops.length;
        const totallaptop = document.querySelector("#totalap");
        totallaptop.innerHTML = "Total Laptops : " + total;
        const table = document.querySelector("#laptop-table");
        const tbody = table.querySelector("tbody");
        tbody.innerHTML = "";
  
        laptops.forEach((laptop) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${laptop.Brand.toUpperCase()} ${laptop.Model}</td>
            <td>${laptop.Cpuman} ${laptop.Cpu} </td>
            <td>${laptop.Ram} GB</td>
            <td>${laptop.SsdSize ? laptop.SsdSize + " GB SSD" : "1 TB HDD"}</td>
            <td>${laptop.Laptopsize} Inch</td>
            <td>${laptop.Gpu}</td>
            <td>${laptop.Price}*</td>
            <td><button onclick="deletelaptop('${laptop._id}')">Delete</button><td>
          `;
          tbody.appendChild(tr);
        });
  
        table.style.display = "table";
      } else {
        console.error(response.status);
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  

function deletelaptop(laptop) {
    // Prompt the user yes or no
    
    console.log(laptop);
    
      const data = {
        _id:laptop
      };
      fetch("/delete_laptop", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
            findLaptops();
          alert("Laptop Deleted Successfully");
          
          // Handle the response from the server as needed
        })
        .catch((error) => {
          // Handle any errors that occur during the fetch request
        });
    } 
  
  
  
  
  document.addEventListener("DOMContentLoaded", findLaptops);
  