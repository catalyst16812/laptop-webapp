const cpuSelect = document.getElementById("cpu");
const cpugenSelect = document.getElementById("cpugen");

const intelCpus = [
	{ name: "Core i3", value: "Core i3" },
	{ name: "Core i5", value: "Core i5" },
	{ name: "Core i7", value: "Core i7" },
	{ name: "Core i9", value: "Core i9" },
];

const amdCpus = [
	{ name: "Ryzen 3 Dual Core", value: "Ryzen 3 Dual Core" },
	{ name: "Ryzen 3 Quad Core", value: "Ryzen 3 Quad Core" },
	{ name: "Ryzen 5 Dual Core", value: "Ryzen 5 Dual Core" },
	{ name: "Ryzen 5 Quad Core", value: "Ryzen 5 Quad Core" },
	{ name: "Ryzen 5 Hexa Core", value: "Ryzen 5 Hexa Core" },
	{ name: "Ryzen 5 Octa Core", value: "Ryzen 5 Octa Core" },
	{ name: "Ryzen 7 Dual Core", value: "Ryzen 7 Dual Core" },
	{ name: "Ryzen 7 Quad Core", value: "Ryzen 7 Quad Core" },
	{ name: "Ryzen 7 Hexa Core", value: "Ryzen 7 Hexa Core" },
	{ name: "Ryzen 7 Octa Core", value: "Ryzen 7 Octa Core" },
	{ name: "Ryzen 9 Octa Core", value: "Ryzen 9 Octa Core" },
];

const intelCpuGens = [
	{ name: "6th Gen", value: "6" },
	{ name: "7th Gen", value: "7" },
	{ name: "8th Gen", value: "8" },
	{ name: "9th Gen", value: "9" },
	{ name: "10th Gen", value: "10" },
	{ name: "11th Gen", value: "11" },
	{ name: "12th Gen", value: "12" },
];

const amdCpuGens = [
	{ name: "3000 Series", value: "3000" },
	{ name: "5000 Series", value: "5000" },
	{ name: "7000 Series", value: "7000" },
];

const updateCpuOptions = (selectedCpuManufacturer) => {
	let cpus = [];
	let cpuGens = [];

	if (selectedCpuManufacturer === "Intel") {
		cpus = intelCpus;
		cpuGens = intelCpuGens;
	} else if (selectedCpuManufacturer === "AMD") {
		cpus = amdCpus;
		cpuGens = amdCpuGens;
	}

	cpuSelect.innerHTML = "";
	cpus.forEach((cpu) => {
		const option = document.createElement("option");
		option.text = cpu.name;
		option.value = cpu.value;
		cpuSelect.add(option);
	});

	cpugenSelect.innerHTML = "";
	cpuGens.forEach((cpuGen) => {
		const option = document.createElement("option");
		option.text = cpuGen.name;
		option.value = cpuGen.value;
		cpugenSelect.add(option);
	});
};

const cpumanInputs = document.querySelectorAll('input[name="cpuman"]');
cpumanInputs.forEach((cpumanInput) => {
	cpumanInput.addEventListener("change", (event) => {
		updateCpuOptions(event.target.value);
	});
});
var gpuInput = document.getElementById("gpu");
var gpuField = document.getElementById("gpu-field");
var ssdSizeInput = document.getElementById("ssdsize");
var ssdSizeField = document.getElementById("ssd-size-field");
var cpuField = document.getElementById("cpu-field");

document.getElementsByName("gputype").forEach(function (radio) {
	radio.addEventListener("click", function () {
		if (radio.value == "Dedicated") {
			gpuField.style.display = "flex";
		} else {
			gpuField.style.display = "none";
			gpuInput.value = "";
		}
	});
});
document.getElementsByName("ssd").forEach(function (radio) {
	radio.addEventListener("click", function () {
		if (radio.value == "Yes") {
			ssdSizeField.style.display = "flex";
		} else {
			ssdSizeField.style.display = "none";
			document.getElementById("ssdsize").value = "";
		}
	});
});
document.getElementsByName("cpuman").forEach(function (radio) {
	radio.addEventListener("click", function () {
		if (radio.value == "intel" || "amd") {
			cpuField.style.display = "flex";
		} else {
			cpuField.style.display = "none";
			document.getElementById("cpu-field").value = "";
		}
	});
});

// ----------------------------------------------

async function saveLaptop(event) {
	event.preventDefault(); // prevent default form submission behavior

	// get form inputs
	const Brand = document.getElementById("brand").value;
	const Model = document.getElementById("model").value;
	const Cpuman = document.querySelector('input[name="cpuman"]:checked').value;
	const Cpu = document.getElementById("cpu").value;
	const CpuGen = parseInt(document.getElementById("cpugen").value);
	const Ram = parseInt(document.getElementById("ram").value);
	const SSD = document.querySelector('input[name="ssd"]:checked').value;
	const SsdSize =
		SSD === "Yes" ? parseInt(document.getElementById("ssdsize").value) : null;
	const gpuTypeRadio = document.querySelector('input[name="gputype"]:checked');
	const gpuType = gpuTypeRadio ? gpuTypeRadio.value : null;
	const Gpu =
		gpuType === "Dedicated"
			? document.getElementById("gpu").value
			: "Integrated";
	const Laptopsize = parseInt(
		document.querySelector('input[name="laptopsize"]:checked').value
	);
	const Price = parseFloat(document.getElementById("price").value);
	const Link = document.getElementById("link").value;

	// create laptop object
	const laptop = {
		Brand,
		Model,
		Cpuman,
		Cpu,
		CpuGen,
		Ram,
		SSD,
		SsdSize,
		gpuType,
		Gpu,
		Laptopsize,
		Price,
		Link,
	};

	console.log(laptop);

	// make POST request to backend API
	fetch("/save_laptop", {
		method: "POST",
		body: JSON.stringify(laptop),//convert to json
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((response) => response.json())
		.then((data) => {
			console.log("Success:", data);
			alert("Laptop saved successfully!");
			// optionally redirect to a success page
      clearForm()
      
		})
		.catch((error) => {
			console.error("Error:", error);
			alert("Error saving laptop. Please try again.");
		});
    
}
// attach saveLaptop function to form submit event
const form = document.getElementById("laptop-form");
form.addEventListener("submit", saveLaptop);
function clearForm() {
  document.getElementById("laptop-form").reset();
}
