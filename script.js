document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targ_sec = document.getElementById(targetId);
        window.scrollTo({
            top: targ_sec.offsetTop,
            behavior: 'smooth'
        });
    });
});

document.querySelectorAll('.buttons a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targ_sec = document.getElementById(targetId);
        window.scrollTo({
            top: targ_sec.offsetTop,
            behavior: 'smooth'
        });
    });
});


const URL = "https://teachablemachine.withgoogle.com/models/rtzjm3-M_/";

let model, webcam, labelContainer, maxPredictions;

const CONFIDENCE_THRESHOLD = 0.8;

const VALID_CLASSES = [
    "Mango -> Anthracnose",
    "Mango -> Bacterial Canker",
    "Mango -> Cutting Weevil",
    "Mango -> Dieback",
    "Mango -> Healthy",
    "Paddy -> Bacterial Leaf Blight",
    "Paddy -> Brown spot",
    "Paddy -> Leaf Blast",
    "Paddy -> Leaf smut",
    "Paddy -> Healthy"
];

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

  
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const flip = true; 
    webcam = new tmImage.Webcam(340, 400, flip); 
    await webcam.setup(); 
    await webcam.play();
    window.requestAnimationFrame(loop);

    
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { 
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function loop() {
    webcam.update(); 
    await predict();
    window.requestAnimationFrame(loop);
}


async function predict() {
    const prediction = await model.predict(webcam.canvas);

    
    let maxProbabilityClass = "";
    let maxProbability = -1;

    for (let i = 0; i < maxPredictions; i++) {
        const currentProbability = prediction[i].probability;

        if (currentProbability > maxProbability) {
            maxProbability = currentProbability;
            maxProbabilityClass = prediction[i].className;
        }
    }

  
    if (VALID_CLASSES.includes(maxProbabilityClass) && maxProbability >= CONFIDENCE_THRESHOLD) {
       
        document.getElementById("highest-probability").innerHTML = `Predicted disease: ${maxProbabilityClass}`;

        
        const probabilityWithTwoDecimalPlaces = (maxProbability * 100).toFixed(2);
        document.getElementById("number").innerHTML = `${probabilityWithTwoDecimalPlaces}%`;

        
        let suggestion = getSuggestion(maxProbabilityClass);
        document.getElementById("predicted").innerHTML = suggestion;
    } else {
 
        document.getElementById("highest-probability").innerHTML = "No valid plant or leaf detected.";
        document.getElementById("number").innerHTML = "0%";
        document.getElementById("predicted").innerHTML = "Please point the camera at a plant or leaf.";
    }
}


function getSuggestion(className) {
    switch (className) {
        case "Mango -> Anthracnose":
            return `
            <h4>1. Prune Infected Parts:</h4> <br>
            <p>=> Trim and remove affected branches and leaves.</p><br>
            <p>=> Dispose of pruned material away from the tree to prevent further spread.</p><br>
            <h4>2. Fungicidal Treatment:</h4> <br>
            <p>=> Apply a recommended fungicide to control the Anthracnose fungus.</p><br>
            <p>=> Follow the manufacturer's instructions for application and dosage.</p><br>
            <h4>3. Improve Air Circulation:</h4> <br>
            <p>=> Ensure proper spacing between trees to enhance air circulation.</p><br>
            <p>=> Good ventilation helps reduce humidity, creating an environment less favorable for fungal growth.</p><br>
            <h4>4. Regular Inspections:</h4> <br>
            <p>=> Conduct frequent inspections of the mango tree.</p><br>
            <p>=> Early detection of Anthracnose symptoms allows for prompt intervention and control.</p><br>
            <h4>5. Maintain Tree Health:</h4> <br>
            <p>=> Provide optimal nutrition and irrigation to keep the mango tree healthy.</p><br>
            <p>=> A healthy tree is better equipped to resist and recover from Anthracnose infections.</p><br>
            `;
        case "Mango -> Bacterial Canker":
            return `
            <h4>1. Prune Affected Areas:</h4> <br>
            <p>=> Trim and remove branches showing canker symptoms.</p><br>
            <p>=> Dispose of infected material properly to prevent further bacterial spread.</p><br>
            <h4>2. Copper-based Sprays:</h4> <br>
            <p>=> Apply copper-based bactericides to affected areas.</p><br>
            <p>=> Follow recommended application rates to control bacterial growth.</p><br>
            <h4>3. Avoid Overhead Irrigation:</h4> <br>
            <p>=> Minimize water splashing on leaves and stems.</p><br>
            <p>=> Use a drip irrigation system to keep foliage dry and reduce bacterial spread.</p><br>
            <h4>4. Copper Infusions:</h4> <br>
            <p>=> Inject copper-based solutions directly into the trunk (copper trunk infusions).</p><br>
            <p>=> This method helps distribute bactericides throughout the tree for systemic control.</p><br>
            <h4>5. Promote Tree Health:</h4> <br>
            <p>=> Ensure proper nutrition and care to maintain tree vigor.</p><br>
            <p>=> Healthy trees are more resilient to bacterial infections and can recover more effectively.</p><br>`;
        case "Mango -> Cutting Weevil":
            return `
            <h4>1. Pruning and Destroying Infested Parts:</h4> <br>
            <p>=> Prune and remove branches with cutting weevil damage.</p><br>
            <p>=> Dispose of infested material properly to prevent the spread of the weevils.</p><br>
            <h4>2. Pesticide Application:</h4> <br>
            <p>=> Apply insecticides or pesticides specifically designed for cutting weevils.</p><br>
            <p>=> Follow recommended guidelines for application, ensuring thorough coverage.</p><br>
            <h4>3. Soil Treatment:</h4> <br>
            <p>=> Apply soil treatments or drenching with insecticides around the base of the tree.</p><br>
            <p>=> This helps target weevil larvae in the soil.</p><br>
            <h4>4. Trapping:</h4> <br>
            <p>=> Use pheromone traps to attract and capture adult cutting weevils.</p><br>
            <p>=> Monitoring and trapping can help reduce the population.</p><br>
            <h4>5. Maintain Orchard Hygiene:</h4> <br>
            <p>=> Keep the orchard clean by removing fallen fruits and debris.</p><br>
            <p>=> This minimizes hiding places for weevils and disrupts their life cycle.</p><br>`;
        case "Mango -> Dieback":
            return `
            <h4>1. Pruning and Removal:</h4> <br>
            <p>=> Prune and remove dead or diseased branches affected by dieback.</p><br>
            <p>=> Dispose of pruned material away from the tree to prevent further infection.</p><br>
            <h4>2. Fungicidal Treatment:</h4> <br>
            <p>=> Apply a fungicide to control the fungal pathogens causing dieback.</p><br>
            <p>=> Follow the recommended dosage and application schedule.</p><br>
            <h4>3. Improve Drainage:</h4> <br>
            <p>=> Ensure proper soil drainage to prevent waterlogging.</p><br>
            <p>=> Excess moisture contributes to fungal growth, so well-draining soil is crucial.</p><br>
            <h4>4. Fertilization and Nutrient Management:</h4> <br>
            <p>=> Provide balanced fertilization to enhance tree health.</p><br>
            <p>=> Adequate nutrients help the mango tree resist and recover from dieback.</p><br>
            <h4>5. Regular Monitoring:</h4> <br>
            <p>=> Conduct regular inspections to detect and address dieback early.</p><br>
            <p>=> Prompt intervention can prevent the spread of the disease throughout the tree.</p><br>`;
        case "Mango -> Healthy":
            return `
            <h4>1. Proper Watering:</h4> <br>
            <p>=> Ensure consistent and appropriate watering, especially during dry periods.</p><br>
            <p>=> Avoid overwatering, as it can lead to root diseases, and ensure good drainage.</p><br>
            <h4>2. Balanced Fertilization:</h4> <br>
            <p>=> Provide the mango tree with a balanced and appropriate fertilizer.</p><br>
            <p>=> Follow recommended guidelines for nutrient application to support healthy growth.</p><br>
            <h4>3. Pruning for Air Circulation:</h4> <br>
            <p>=> Prune the tree to improve air circulation within the canopy.</p><br>
            <p>=> Adequate ventilation helps prevent fungal diseases and promotes overall health.</p><br>
            <h4>4. Pest and Disease Management:</h4> <br>
            <p>=> Implement proactive pest and disease management practices.</p><br>
            <p>=> Regularly inspect the tree for signs of pests or diseases and take prompt action.</p><br>
            <h4>5. Mulching:</h4> <br>
            <p>=> Apply a layer of organic mulch around the base of the tree.</p><br>
            <p>=> Mulching helps retain soil moisture, suppress weeds, and regulate soil temperature.</p><br>`;
        case "Paddy -> Bacterial Leaf Blight":
            return `
            <h4>1. Field Sanitation:</h4> <br>
            <p>=> Remove and destroy infected plant debris from the field.</p><br>
            <p>=> This helps reduce the source of bacteria and prevents further spread.</p><br>
            <h4>2. Crop Rotation:</h4> <br>
            <p>=> Practice crop rotation to break the disease cycle.</p><br>
            <p>=> Avoid planting rice in the same field consecutively to minimize bacterial buildup.</p><br>
            <h4>3. Use Resistant Varieties:</h4> <br>
            <p>=> Choose and plant rice varieties that are resistant or tolerant to Bacterial Leaf Blight.</p><br>
            <p>=> Resistant varieties can help mitigate the impact of the disease.</p><br>
            <h4>4. Foliar Sprays with Copper-Based Fungicides:</h4> <br>
            <p>=> Apply copper-based bactericides or other recommended chemicals as foliar sprays.</p><br>
            <p>=> Follow recommended application rates and schedules to control bacterial growth.</p><br>
            <h4>5. Water Management:</h4> <br>
            <p>=> Practice controlled and proper irrigation to minimize water splash.</p><br>
            <p>=> Bacterial Leaf Blight spreads through water, and managing water effectively can reduce disease spread.</p><br>`;
        case "Paddy -> Brown spot":
            return `
            <h4>1. Fungicidal Treatment:</h4> <br>
            <p>=> Apply fungicides specifically designed for controlling Brown Spot.</p><br>
            <p>=> Follow recommended guidelines for application, ensuring thorough coverage.</p><br>
            <h4>2. Balanced Fertilization:</h4> <br>
            <p>=> Provide balanced and adequate fertilization to promote plant health.</p><br>
            <p>=> Nutrient-rich plants are better equipped to resist and recover from diseases.</p><br>
            <h4>3. Crop Rotation:</h4> <br>
            <p>=> Practice crop rotation to break the disease cycle.</p><br>
            <p>=> Avoid continuous cultivation of rice in the same field to reduce disease pressure.</p><br>
            <h4>4. Timely Planting:</h4> <br>
            <p>=> Optimize planting time to avoid extended periods of high humidity.</p><br>
            <p>=> Brown Spot thrives in humid conditions, so proper timing can help reduce disease incidence.</p><br>
            <h4>5. Remove Infected Residues:</h4> <br>
            <p>=> Remove and destroy infected plant residues after harvesting.</p><br>
            <p>=> This reduces the source of the Brown Spot pathogen and helps prevent future infections.</p><br>`;
        case "Paddy -> Leaf Blast":
            return `
            <h4>1. Resistant Varieties:</h4> <br>
            <p>=> Plant rice varieties that are resistant or tolerant to Leaf Blast.</p><br>
            <p>=> Resistant varieties can help minimize the impact of the disease.</p><br>
            <h4>2. Fungicidal Treatment:</h4> <br>
            <p>=> Apply fungicides specifically designed for controlling Leaf Blast.</p><br>
            <p>=> Follow recommended guidelines for application to manage the fungal pathogen.</p><br>
            <h4>3. Proper Water Management:</h4> <br>
            <p>=> Avoid excessive water on leaves, as Leaf Blast thrives in wet conditions.</p><br>
            <p>=> Practice controlled irrigation to minimize leaf wetness and reduce disease spread.</p><br>
            <h4>4. Crop Rotation:</h4> <br>
            <p>=> Rotate crops to disrupt the disease cycle and reduce inoculum in the field.</p><br>
            <p>=> Avoid continuous cultivation of rice in the same area to mitigate Leaf Blast.</p><br>
            <h4>5. Timely Planting:</h4> <br>
            <p>=> Optimize planting time to avoid periods of high humidity.</p><br>
            <p>=> Adjust planting schedules to reduce the risk of Leaf Blast infection.</p><br>`;
        case "Paddy -> Leaf smut":
            return `
            <h4>1. Seed Treatment:</h4> <br>
            <p>=> Treat seeds with fungicides before planting to control the smut pathogen.</p><br>
            <p>=> Ensure thorough coverage of seeds for effective prevention.</p><br>
            <h4>2. Resistant Varieties:</h4> <br>
            <p>=> Plant rice varieties that are known to be resistant or less susceptible to Leaf Smut.</p><br>
            <p>=> Resistant varieties can help reduce the impact of the disease.</p><br>
            <h4>3. Proper Water Management:</h4> <br>
            <p>=> Avoid waterlogged conditions as Leaf Smut thrives in excessively wet environments.</p><br>
            <p>=> Implement proper water management practices to prevent prolonged periods of soil saturation.</p><br>
            <h4>4. Crop Rotation:</h4> <br>
            <p>=> Rotate crops to break the disease cycle and reduce the buildup of inoculum in the soil.</p><br>
            <p>=> Avoid consecutive rice cultivation in the same field.</p><br>
            <h4>5. Sanitation Practices:</h4> <br>
            <p>=> Remove and destroy infected plant materials and residues.</p><br>
            <p>=> Implement good field hygiene to minimize the source of the Leaf Smut pathogen.</p><br>`;
        case "Paddy -> Healthy":
            return `
            <h4>1. Balanced Fertilization:</h4> <br>
            <p>=> Provide balanced and timely fertilization to ensure optimal nutrient levels.</p><br>
            <p>=> Nutrient-rich plants are more resilient to diseases and environmental stress.</p><br>
            <h4>2. Proper Water Management:</h4> <br>
            <p>=> Implement efficient irrigation practices to meet the water needs of the crops.</p><br>
            <p>=> Avoid waterlogging or prolonged drought to maintain healthy plant growth.</p><br>
            <h4>3. Resistant Varieties:</h4> <br>
            <p>=> Choose and plant rice varieties that are resistant or tolerant to common diseases and pests.</p><br>
            <p>=> Resistant varieties contribute to a healthier crop and higher yields.</p><br>
            <h4>4. Crop Rotation:</h4> <br>
            <p>=> Practice crop rotation to break disease cycles and manage soil health.</p><br>
            <p>=> Avoid continuous cultivation of rice in the same field to reduce the risk of diseases.</p><br>
            <h4>5. Integrated Pest Management (IPM):</h4> <br>
            <p>=> Implement IPM strategies to control pests and diseases.</p><br>
            <p>=> Use biological controls, cultural practices, and judicious pesticide application to maintain a healthy crop ecosystem.</p><br>`;
        default:
            return "Sorry, this disease is not yet trained.";
    }
}


init();