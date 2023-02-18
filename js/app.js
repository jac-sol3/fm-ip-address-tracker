// API IP GeoLocation Docs => https://ipapi.co/api/
// API Map Docs => https://leafletjs.com/reference.html

const MY_IP_URL = "https://ipapi.co/json/";
let ipAddressInfo = {};

// Dashboard elements
const ipElement = document.querySelector(".content-ip");
const locationElement = document.querySelector(".content-location");
const timezoneElement = document.querySelector(".content-timezone");
const ispElement = document.querySelector(".content-isp");

// Creating map element
const map = L.map("map").setView([0, 0], 13);
const markerIcon = L.icon({
  iconUrl: "../images/icon-location.svg",
  iconSize: [24, 32],
});
let marker = L.marker([0, 0], { icon: markerIcon }).addTo(map);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

function getIpAddress(e) {
  e.preventDefault();
  const strIP = this.querySelector("[name=ip]").value;
  const IP_URL = `https://ipapi.co/${strIP}/json/`;
  renderDashboard(IP_URL);
}

function renderDashboard(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      ipAddressInfo = {
        ip: data.ip,
        country: data.country,
        region: data.region,
        city: data.city,
        cord_lat: data.latitude,
        cord_long: data.longitude,
        timezone: data.utc_offset,
        isp: data.org,
      };
      renderIpAddressInfo(ipAddressInfo);
      renderMap(ipAddressInfo.cord_lat, ipAddressInfo.cord_long);
    });
}

function renderIpAddressInfo(info) {
  const city = info.city == null ? "-" : info.city;
  const region = info.region == null ? "-" : info.region;
  const country = info.country == null ? "-" : info.country;
  const timezone = info.timezone == null ? "-" : "UTC " + info.timezone.substring(0, 3) + ":00";
  const isp = info.isp == null ? "-" : info.isp;

  ipElement.textContent = info.ip;
  locationElement.textContent = `${city}, ${region}, ${country}`;
  timezoneElement.textContent = timezone;
  ispElement.textContent = isp;
}

function renderMap(lat, long) {
  if (lat == null || long == null) {
    alert("Map could not be loaded.");
  } else {
    map.setView([lat + 0.008, long], 13);
    marker.remove();
    marker = L.marker([lat, long], { icon: markerIcon }).addTo(map);
  }
}

document.querySelector("#form-inputs").addEventListener("submit", getIpAddress);

window.onload = function () {
  try {
    renderDashboard(MY_IP_URL);
  } catch (error) {
    alert("Unknown error. Please try again later.");
  }
};
