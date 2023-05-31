const express = require("express");
const lapModel = require("./laptopmodel");
const nodemailer = require("nodemailer");
const app = express();


app.post("/save_laptop", async (request, response) => {
  let custom_entry = true;
  try {
    
    const laptop = new lapModel({
      ...request.body,
      Selfadd:custom_entry
    });

    console.log(laptop);
    await laptop.save();
    response.send(laptop);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post("/add_bulk/", async (request, response) => {
  try {
    const laptops = request.body;
    
    for (let i = 0; i < laptops.length; i++) {
      const laptop = new lapModel({
        ...laptops[i]
      });
      await laptop.save();
    }
    
    response.send("Laptops added successfully.");
  } catch (error) {
    response.status(500).send(error);
  }
});


app.post("/all_laptop", async (request, response) => {
  try {
    const price = request.body.price || 999999; 
    const ram = request.body.ram;
    const ssd = request.body.ssd ;
    const brand = request.body.brand ;
    const mylaptop = request.body.custom === "true" ? true : false;

    let query = {};

    query.Price = { $lte: price }; // include price condition

    if(mylaptop === true)
    {query.Selfadd = { $eq: true };}

    if (ssd === 0) {
      query.SSD = "No";
    } 
    else if (ssd===128) {
      query.SsdSize = 128;
    }
    else if (ssd===256) {
      query.SsdSize = 256;
    }
    else if (ssd===512) {
      query.SsdSize = 512;
    }
    else if (ssd===1024) {
      query.SsdSize = 1024;
    }

    let laptops = await lapModel.find(query).sort({ _id: -1 });
    
    if (ram) {
      laptops = laptops.filter(laptop => laptop.Ram === ram);
    }
    if (brand) {
      laptops = laptops.filter(laptop => laptop.Brand.toLowerCase() === brand.toLowerCase());
    }
    response.send(laptops);
  } catch (error) {
    response.status(500).send(error);
  }
});


app.post("/find_laptop", async (request, response) => {
  try {
    const usecase = request.body.usecase;
    const price = request.body.price || 999999; 
    const ram = request.body.ram;
    const ssd = request.body.ssd ;
    const brand = request.body.brand ;
    const mylaptop = request.body.custom === "true" ? true : false;

          // console.log(ssd,ram,brand,mylaptop);
    let query = {};
    if (usecase === "school") {
      query = { Cpu: { $in: ["Core i3","Pentium Quad Core","Pentium Silver","Celeron Dual Core","Celeron Quad Core","Ryzen 3 Dual Core","Snapdragon 7c Gen 2","Athlon Dual Core"] } };
    } else if (usecase === "work") {
      query = {
        $or: [
          { Cpu: { $in: ["Core i3","Core i5","Ryzen 3 Quad Core","Ryzen 5 Dual Core","Ryzen 5 Quad Core"] } },
          { Gpu: /Integrated/i } // include "Integrated" GPU laptops
        ]
      };
    } else if (usecase === "gaming") {
      query = { $and: [
          { Cpu: { $in: ["Core i5","Core i7","Ryzen 5 Hexa Core","Ryzen 5 Octa Core","Ryzen 5 Quad Core","Ryzen 7 Dual Core","Ryzen 7 Quad Core","Ryzen 7 Hexa Core"] } },
          { Gpu: { $not: /Integrated/i } } // exclude laptops with Integrated GPU
      ]};
    } else if (usecase === "production") {
      query = { $and: [
          { Cpu: { $in: ["Core i7","Core i9","Ryzen 5 Quad Core","Ryzen 7 Quad Core","Ryzen 7 Hexa Core","Ryzen 7 Octa Core","Ryzen 9 Octa Core"] } },
          { Gpu: { $not: /Integrated/i } } // exclude laptops with Integrated GPU
        ]};
    }
    query.Price = { $lte: price }; // include price condition

    if(mylaptop === true){query.Selfadd = true}
    
    if (ssd === 0) {
      query.SSD = "No";
    } 
    else if (ssd===128) {
      query.SsdSize = 128;
    }
    else if (ssd===256) {
      query.SsdSize = 256;
    }
    else if (ssd===512) {
      query.SsdSize = 512;
    }
    else if (ssd===1024) {
      query.SsdSize = 1024;
    }

    let laptops = await lapModel.find(query).sort({ Price: -1 });

    // Filter laptops by RAM value, if provided
    if (ram) {
      laptops = laptops.filter(laptop => laptop.Ram === ram);
    }
    if (brand) {
      laptops = laptops.filter(laptop => laptop.Brand.toLowerCase() === brand.toLowerCase());
    }

    const firstFiveLaptops = laptops.slice(0, 5);
    response.send(firstFiveLaptops);
  } catch (error) {
    response.status(500).send(error);
  }
});


// Deletes the given draft. This is a POST request and does not require authentication
app.delete("/delete_laptop", async (request, response) => {
  const lapId = request.body._id;

  try {
    const laptop = await lapModel.findByIdAndDelete(lapId);
    if (!laptop) {
      return response.send("laptop not found");
    }
    response.send("laptop deleted successfully");
  } catch (error) {
    response.status(500).send(error);
  }
});

//send mail to the user
app.post("/mailer", async (request, response) => {
    const email  = request.body.emailid;
    const id = request.body.laptop;

  try {
    console.log(id,email)
    const laptoplist = await lapModel.find({_id:id});
    const laptop = laptoplist[0];
    let mod = laptop.Model;
    console.log(laptop.Brand,mod)
    //-------------------------------------
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use SSL
  auth: {
    user: "catalyst16812@gmail.com",
    pass: "knuyavnxspctqjij",
  },
});
//------------------------------------
//-------------------------------------
function sendEmail() {
  let mailOptions = {
    from: "catalyst16812@gmail.com",
    to: email,
    subject: "Details for Laptop - "+laptop.Brand+" "+laptop.Model,
    text: `Dear User,

    We are pleased to inform you about the following laptop that you have expressed interest in:
    
    Brand: ${laptop.Brand}
    Model: ${laptop.Model}
    Processor: ${laptop.Cpu} (${laptop.Cpuman} Generation ${laptop.CpuGen})
    RAM: ${laptop.Ram} GB
    Storage:  ${laptop.SSD ? laptop.SsdSize+' GB SSD' : '1 TB HDD'}
    Screen Size: ${laptop.Laptopsize} inch
    Graphics Card: ${laptop.Gpu}
    Price: Rs ${laptop.Price}
    
    You can purchase this laptop by visiting the following link: ${laptop.Link}
    
    Thank you for your interest in our products.
    
    Best regards,
    Nikhil Vishwakarma` ,
  };

  /**
   * @param error
   * @param info
   */
  transporter.sendMail(mailOptions, function (error, info) {
    // Send the email to the server.
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}
//-------------------------------------
    sendEmail();
  } catch (error) {
    response.status(500).send(error);
  }
});

module.exports = app;
