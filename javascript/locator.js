mapboxgl.accessToken =
  "pk.eyJ1IjoiYXNpaW1hd2UyMzQiLCJhIjoiY2wyNGprNGU4MjBndTNibHBuOGt0N2ZxayJ9.f6CZwHkp4pTAqwilBl_bcg";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v10",
  // center: [-77.034084, 38.909671],
  center: [32.59604157405252, 0.3185463979220202],
  // center: [32.3032414, 1.3707295],
  zoom: 15,
  scrollZoom: false,
});

// Note to change the datasets of the locations to the ones you want to show.
const centers = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [33.20317, 0.43902],
      },
      properties: {
        phone: " 0782743383",
        address: "Jinja",
        name: "Ring of Hope",
        country: "Uganda",
        crossStreet: "at 15th St NW",
      },
    },
  ],
};

//
centers.features.forEach(function (center, i) {
  center.properties.id = i;
});

map.on("load", () => {
  /* Add the data to your map as a layer */
  map.addLayer({
    id: "locations",
    type: "circle",

    /* Add a GeoJSON source containing place coordinates and information. */
    source: {
      type: "geojson",
      data: centers,
    },
  });
  buildLocationList(centers);
});

map.on("click", (event) => {
  /* Determine if a feature in the "locations" layer exists at that point. */
  const features = map.queryRenderedFeatures(event.point, {
    layers: ["locations"],
  });

  /* If it does not exist, return */
  if (!features.length) return;

  const clickedPoint = features[0];

  /* Fly to the point */
  flyTocenter(clickedPoint);

  /* Close all other popups and display popup for clicked center */
  createPopUp(clickedPoint);

  /* Highlight listing in sidebar (and remove highlight for all other listings) */
  const activeItem = document.getElementsByClassName("active");
  if (activeItem[0]) {
    activeItem[0].classList.remove("active");
  }
  const listing = document.getElementById(
    `listing-${clickedPoint.properties.id}`
  );
  listing.classList.add("active");
});

function buildLocationList(centers) {
  for (const center of centers.features) {
    /* Add a new listing section to the sidebar. */
    const listings = document.getElementById("listings");
    const listing = listings.appendChild(document.createElement("div"));
    /* Assign a unique `id` to the listing. */
    listing.id = `listing-${center.properties.id}`;
    /* Assign the `item` class to each listing for styling. */
    listing.className = "item";

    /* Add the link to the individual listing created above. */
    const link = listing.appendChild(document.createElement("a"));
    link.href = "#";
    link.className = "title";
    link.id = `link-${center.properties.id}`;
    link.innerHTML = `${center.properties.address}`;

    link.addEventListener("click", function () {
      for (const feature of centers.features) {
        if (this.id === `link-${feature.properties.id}`) {
          flyTocenter(feature);
          createPopUp(feature);
        }
      }
      const activeItem = document.getElementsByClassName("active");
      if (activeItem[0]) {
        activeItem[0].classList.remove("active");
      }
      this.parentNode.classList.add("active");
    });

    /* Add details to the individual listing. */
    const details = listing.appendChild(document.createElement("div"));
    details.innerHTML = `${center.properties.name}`;
    if (center.properties.phone) {
      details.innerHTML += ` · ${center.properties.phone}`;
    }
    if (center.properties.distance) {
      const roundedDistance =
        Math.round(center.properties.distance * 100) / 100;
      details.innerHTML += `<div><strong>${roundedDistance} miles away</strong></div>`;
    }
  }
}

function flyTocenter(currentFeature) {
  map.flyTo({
    center: currentFeature.geometry.coordinates,
    zoom: 15,
  });
}

function createPopUp(currentFeature) {
  const popUps = document.getElementsByClassName("mapboxgl-popup");
  /** Check if there is already a popup on the map and if so, remove it */
  if (popUps[0]) popUps[0].remove();

  const popup = new mapboxgl.Popup({ closeOnClick: false })
    .setLngLat(currentFeature.geometry.coordinates)
    .setHTML(`<h4>${currentFeature.properties.name}</h4>`)
    .addTo(map);
}
