// Global variables
let peopleData = [];
let currentPeopleGroup = null;

// DOM elements
const loadingElement = document.getElementById('loading');
const peopleGroupContainer = document.getElementById('peopleGroupContainer');
const heroImageElement = document.getElementById('heroImage');
const peopleNameElement = document.getElementById('peopleName');
const peopleNameInlineElement = document.getElementById('peopleNameInline');
const countryBadgeElement = document.getElementById('countryBadge');
const populationElement = document.getElementById('population');
const languageElement = document.getElementById('language');
const scriptureStatusElement = document.getElementById('scriptureStatus');
const descriptionElement = document.getElementById('description');
const uniqueTraitsElement = document.getElementById('uniqueTraits');
const prayerPointsElement = document.getElementById('prayerPoints');
const shareButton = document.getElementById('shareButton');
const randomButton = document.getElementById('randomButton');
const shareModal = document.getElementById('shareModal');
const aboutModal = document.getElementById('aboutModal');
const contactModal = document.getElementById('contactModal');
const aboutLink = document.getElementById('aboutLink');
const contactLink = document.getElementById('contactLink');
const currentYearElement = document.getElementById('currentYear');

// Set current year in footer
currentYearElement.textContent = new Date().getFullYear();

// Initialize the application
async function initApp() {
  try {
    // Load the people data
    await loadPeopleData();
    
    // Get today's people group
    const todaysPeopleGroup = getTodaysPeopleGroup();
    
    // Display the people group
    displayPeopleGroup(todaysPeopleGroup);
    
    // Set up event listeners
    setupEventListeners();
    
    // Hide loading and show content
    loadingElement.classList.remove('loading-visible');
    peopleGroupContainer.style.display = 'block';
  } catch (error) {
    console.error('Error initializing app:', error);
    loadingElement.classList.add('loading-visible');
    loadingElement.innerHTML = `<p>Error loading data. Please try again later.</p>`;
  }
}

// Load people data from JSON file
async function loadPeopleData() {
  const response = await fetch('uupg_data.json');
  peopleData = await response.json();
  console.log(`Loaded ${peopleData.length} people groups`);
}

// Determine today's people group based on the date
function getTodaysPeopleGroup() {
  // For testing, always return the Abu-Junuk people group (index 0)
  return peopleData[0]; // Abu-Junuk people group with proper image
}

// Get a random people group
function getRandomPeopleGroup() {
  const index = Math.floor(Math.random() * peopleData.length);
  return peopleData[index];
}

// Display the people group information
function displayPeopleGroup(peopleGroup) {
  currentPeopleGroup = peopleGroup;
  
  // Set hero image
  heroImageElement.style.backgroundImage = `url(${peopleGroup.imageUrl})`;
  
  // Set basic information
  peopleNameElement.textContent = peopleGroup.PeopleName;
  peopleNameInlineElement.textContent = peopleGroup.PeopleName;
  countryBadgeElement.textContent = peopleGroup.Country;
  populationElement.textContent = formatNumber(peopleGroup.Population);
  
  // Ensure language is displayed in English lettering or show 'Unknown'
  let language = peopleGroup.Language;
  if (language === 'Undetermined') {
    language = 'Unknown';
  } else {
    // Replace non-ASCII characters with their closest ASCII equivalents or remove them
    language = language.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\x00-\x7F]/g, ''); // Remove any remaining non-ASCII characters
    // If after cleaning the language is empty, show 'Unknown'
    if (!language.trim()) {
      language = 'Unknown';
    }
  }
  languageElement.textContent = language;
  scriptureStatusElement.textContent = peopleGroup.scriptureStatus;
  descriptionElement.textContent = peopleGroup.Description;
  
  // Set unique traits
  uniqueTraitsElement.innerHTML = '';
  peopleGroup.uniqueTraits.forEach(trait => {
    const li = document.createElement('li');
    li.textContent = trait;
    uniqueTraitsElement.appendChild(li);
  });
  
  // Set prayer points
  prayerPointsElement.innerHTML = '';
  peopleGroup.prayerPoints.forEach(point => {
    const li = document.createElement('li');
    li.textContent = point;
    prayerPointsElement.appendChild(li);
  });
  
  // Update document title
  document.title = `${peopleGroup.PeopleName} | Daily No Access Prayer Guide`;
  
  // Update share buttons
  updateShareButtons(peopleGroup);
}

// Format number with commas
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Set up event listeners
function setupEventListeners() {
  // Random button
  randomButton.addEventListener('click', () => {
    const randomPeopleGroup = getRandomPeopleGroup();
    displayPeopleGroup(randomPeopleGroup);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  
  // Share button
  shareButton.addEventListener('click', () => {
    shareModal.style.display = 'flex';
  });
  
  // About link
  aboutLink.addEventListener('click', (e) => {
    e.preventDefault();
    aboutModal.style.display = 'flex';
  });
  
  // Contact link
  contactLink.addEventListener('click', (e) => {
    e.preventDefault();
    contactModal.style.display = 'flex';
  });
  
  // Close buttons for modals
  document.querySelectorAll('.close-button').forEach(button => {
    button.addEventListener('click', () => {
      shareModal.style.display = 'none';
      aboutModal.style.display = 'none';
      contactModal.style.display = 'none';
    });
  });
  
  // Close modals when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === shareModal) shareModal.style.display = 'none';
    if (e.target === aboutModal) aboutModal.style.display = 'none';
    if (e.target === contactModal) contactModal.style.display = 'none';
  });
  
  // Share options
  document.getElementById('shareFacebook').addEventListener('click', () => {
    shareOnFacebook();
  });
  
  document.getElementById('shareTwitter').addEventListener('click', () => {
    shareOnTwitter();
  });
  
  document.getElementById('shareEmail').addEventListener('click', () => {
    shareViaEmail();
  });
  
  document.getElementById('shareCopy').addEventListener('click', () => {
    copyShareLink();
  });
  
  // Contact form
  document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    // In a real app, you would send the form data to a server
    alert('Thank you for your message! We will get back to you soon.');
    contactModal.style.display = 'none';
    document.getElementById('contactForm').reset();
  });
}

// Update share buttons with current people group info
function updateShareButtons(peopleGroup) {
  // These functions would be implemented to share on various platforms
  // For now, we'll just set up the basics
}

// Share functions
function shareOnFacebook() {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(`Pray for the ${currentPeopleGroup.PeopleName} people of ${currentPeopleGroup.Country}`);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}`, '_blank');
}

function shareOnTwitter() {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(`Pray for the ${currentPeopleGroup.PeopleName} people of ${currentPeopleGroup.Country} - ${formatNumber(currentPeopleGroup.Population)} people with no access to the Gospel. #NoAccessPeoples`);
  window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
}

function shareViaEmail() {
  const subject = encodeURIComponent(`Daily No Access Prayer Guide: ${currentPeopleGroup.PeopleName} people`);
  const body = encodeURIComponent(`I'm praying for the ${currentPeopleGroup.PeopleName} people of ${currentPeopleGroup.Country} today. They are a people group with no access to the Gospel, with a population of ${formatNumber(currentPeopleGroup.Population)}. Learn more at: ${window.location.href}`);
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

function copyShareLink() {
  const tempInput = document.createElement('input');
  document.body.appendChild(tempInput);
  tempInput.value = window.location.href;
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
  
  // Show a temporary message
  const shareCopyButton = document.getElementById('shareCopy');
  const originalText = shareCopyButton.innerHTML;
  shareCopyButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
  setTimeout(() => {
    shareCopyButton.innerHTML = originalText;
  }, 2000);
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
