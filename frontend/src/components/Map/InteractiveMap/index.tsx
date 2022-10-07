import React, { useEffect, useMemo, useRef, useState } from "react";
import { IPlot, IPerson } from "../../../types/schema";
import averageCoordinates from "./utils/averageCoordinates";
import getAnniversaryPlots from "./utils/getAnniversaryPlots";
import { getCookie } from "typescript-cookie";
import { dateToString } from "../../../utils/dates";
//import useGet from "../../../hooks/useGet";
//import { Images } from "../../../components/Profile/Images";
//import { url } from "inspector";

interface InteractiveMapProps {
  plots: IPlot[];
  selectedPlot: IPlot | undefined;
  onClick: (plotNumber: number) => void;
  showLocation: boolean;
  className: string;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  plots,
  selectedPlot,
  onClick,
  showLocation,
  className,
}: InteractiveMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();

  const darkMode = getCookie("darkMode");
  // const [cookies, setCookie] = useCookies(["user"]);

  // // Memorise map instance
  // // initialise mapId
  const mapId: string =
    darkMode == "true" ? "c1b071c4df766122" : "22722d672fb630c2";
  const plotColour: string = darkMode == "true" ? "#428BCA" : "#F0F26B";

  // Memorise map instance
  useEffect(() => {
    if (mapRef.current) {
      setMap(
        new google.maps.Map(mapRef.current, {
          center: { lat: -36.8728, lng: 174.78028 },
          zoom: 19,
          minZoom: 18,
          restriction: {
            latLngBounds: {
              north: -36.87,
              south: -36.875,
              east: 174.785,
              west: 174.775,
            },
          },
          disableDefaultUI: true,
          zoomControl: false,
          mapTypeControl: true,
          mapTypeControlOptions: {
            mapTypeIds: ["roadmap", "satellite"],
          },
          mapId: mapId,
        })
      );
    }
  }, [mapRef, mapId]);

  // Initialise overlay
  useEffect(() => {
    if (map) {
      new google.maps.GroundOverlay(
        "https://storage.googleapis.com/smg-images/map-in-chunks-rotated-3.png",
        {
          north: -36.872385,
          south: -36.873336,
          east: 174.780744,
          west: 174.779711,
        }
      ).setMap(map);
    }
  }, [map]);

  const [polygonsByNumber, setPolygonsByNumber] =
    useState<Map<number, google.maps.Polygon>>();

  // Initialise plots
  useEffect(() => {
    const hallCoords = [
      { lat: -36.87274, lng: 174.78065 },
      { lat: -36.87294, lng: 174.78043 },
      { lat: -36.87305, lng: 174.7806 },
      { lat: -36.87297, lng: 174.78069 },
      { lat: -36.87296, lng: 174.78066 },
      { lat: -36.87283, lng: 174.78079 },
      { lat: -36.87274, lng: 174.78065 },
    ];

    const hallPlot = new google.maps.Polygon({
      paths: hallCoords,
      strokeColor: "#FFC0CB",
      strokeOpacity: 0.6,
      strokeWeight: 2,
      fillColor: "#FFB6C1",
      fillOpacity: 0.2,
    });

    const churchCoords = [
      { lat: -36.87283, lng: 174.78016 },
      { lat: -36.87287, lng: 174.78015 },
      { lat: -36.87285, lng: 174.78 },
      { lat: -36.87296, lng: 174.77999 },
      { lat: -36.87296, lng: 174.78001 },
      { lat: -36.87301, lng: 174.78 },
      { lat: -36.87302, lng: 174.78011 },
      { lat: -36.87305, lng: 174.78012 },
      { lat: -36.87305, lng: 174.78018 },
      { lat: -36.87303, lng: 174.78019 },
      { lat: -36.87303, lng: 174.78024 },
      { lat: -36.87297, lng: 174.78026 },
      { lat: -36.87297, lng: 174.78034 },
      { lat: -36.87286, lng: 174.7803 },
    
      { lat: -36.87283, lng: 174.78016 },
    ];

    const churchPlot = new google.maps.Polygon({
      paths: churchCoords,
      strokeColor: "#ff8b11",
      strokeOpacity: 0.6,
      strokeWeight: 2,
      fillColor: "#f9cb9c",
      fillOpacity: 0.2,
    });
    
  
    const pathCoords = [
      { lat: -36.87254, lng: 174.78053 },
      { lat: -36.87272, lng: 174.78024 },
      { lat: -36.87286, lng: 174.78002 },
      { lat: -36.872873, lng: 174.780039 },
      { lat: -36.87292, lng: 174.77998 },
      { lat: -36.87295, lng: 174.77999 },
      { lat: -36.87296, lng: 174.78003 },
      { lat: -36.873010, lng: 174.78003 },
      { lat: -36.873064, lng: 174.78016 },
      { lat: -36.873042, lng: 174.78034 },
      { lat: -36.87302, lng: 174.78038 },
      { lat: -36.87304, lng: 174.78042 },
      { lat: -36.87303, lng: 174.78044 },
      { lat: -36.873005, lng: 174.78039 },
      { lat: -36.87293, lng: 174.78042 },
      { lat: -36.87288, lng: 174.78036 },
      { lat: -36.87286, lng: 174.78036 },
      { lat: -36.872835, lng: 174.780344 },
      { lat: -36.87282, lng: 174.780344 },
      { lat: -36.872805, lng: 174.780309 },
      { lat: -36.87279, lng: 174.780273 },
      { lat: -36.87276, lng: 174.7802578 },
      { lat: -36.872555, lng: 174.780555 },
    ];
    
    const pathPlot = new google.maps.Polygon({
      paths: pathCoords,
      strokeColor: "#fafbdf",
      strokeOpacity: 0.6,
      strokeWeight: 2,
      fillColor: "#fffff2",
      fillOpacity: 0.2,
    });

    const polygons = plots.reduce((polygonMap, plot) => {
      const polygon = new google.maps.Polygon({
        paths: plot.coordinates,
        strokeColor: plotColour,
        strokeOpacity: 0.6,
        strokeWeight: 2,
        fillColor: plotColour,
        fillOpacity: 0.2,
        zIndex: 9999999
      });
      
      const churchIcon = {
        url: "https://uxwing.com/wp-content/themes/uxwing/download/festival-culture-religion/church-building-icon.svg", // url
        scaledSize: new google.maps.Size(25, 25), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(13, 20), // origin
      };

      const hallIcon = {
        url: "https://cdn-icons-png.flaticon.com/512/4474/4474469.png", // url
        scaledSize: new google.maps.Size(25, 25), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(13, 20), // origin
      };


      const churchMarker = new google.maps.Marker({
        position: { lat: -36.87293, lng: 174.78016 },
        icon: churchIcon,
        map: map,
        title: "St Mark's Church",
        optimized: false,
        zIndex:99999999,
        animation: google.maps.Animation.DROP,
      });

      const hallhMarker = new google.maps.Marker({
        position: { lat: -36.87289, lng: 174.78062 },
        icon: hallIcon,
        map: map,
        title: "St Mark's Parish Hall",
        optimized: false,
        zIndex:99999999,
        animation: google.maps.Animation.DROP,
      });
          
      pathPlot.setMap(map ?? null);
      churchPlot.setMap(map ?? null);
      hallPlot.setMap(map ?? null);
      churchMarker.setMap(map ?? null);
      hallhMarker.setMap(map ?? null);
      polygon.setMap(map ?? null);
      const point = averageCoordinates(plot.coordinates);

      const infowindow1 = new google.maps.InfoWindow({
        zIndex: 3,
        maxWidth: 250,
      });
      const infowindow = new google.maps.InfoWindow({
        zIndex: 2,
      });

      const personId = plot.buried.map((person: IPerson) => person._id);
      const personNames = plot.buried.map((person: IPerson) => person.fullName);
      const personDateOfBirths = plot.buried.map((person: IPerson) =>
        "<p></p>" + person.dateOfBirth
          ? dateToString(person.dateOfBirth)
          : "Unknown"
      );
      const personDateOfDeaths = plot.buried.map((person: IPerson) =>
        "<p></p>" + person.dateOfDeath
          ? dateToString(person.dateOfDeath)
          : "Unknown"
      );

      polygon.addListener("mouseover", () => {
        infowindow.setContent(
          "<h2>" +
            plot.registeredName +
            " Plot #" +
            plot.plotNumber +
            "</h2>" +
            "<b>" +
            "<p>Number of People: " +
            plot.buried.length +
            "</p>" +
            "</b>" +
            "<div id='button'></div>" +
            "<br></br>"
        );
        infowindow.setPosition(point);
        infowindow.open(map);
      });

      google.maps.event.addListener(infowindow, "domready", () => {
        const parentbtn = document.getElementById("button");
        for (let i = 0; i < personNames.length; i++) {
          const btn = document.createElement("button");
          btn.id = String(i);
          btn.innerHTML = personNames[i] + "&#8505";
          if (parentbtn !== null) {
            parentbtn.appendChild(btn);
          }
        }

        parentbtn?.addEventListener("click", (e) => {
          if (e.target !== null) {
            const btn = e.target as Element;
            const btnNumber = Number(btn.id);
            const profileLink: string = "'profile/" + personId[btnNumber] + "'";
            const aLink: string = "<a href=" + profileLink + ">";

            const fetchPromise = fetch(`/api/person/${personId[btnNumber]}`);

            fetchPromise.then((response) => {
              const jsonPromise = response.json();
              jsonPromise.then((data) => {
                if (data.images[0] !== undefined) {
                  const imageUrl = data.images[0].url;
                  const personImageUrl: string =
                    "<img src=" + imageUrl + " width='200' height='100'}>";
                  infowindow1.setContent(
                    "<p></p>" +
                      "<h2>" +
                      "<b>" +
                      aLink +
                      personNames[btnNumber] +
                      "</a></b></h2>" +
                      "<p></p>" +
                      aLink +
                      personImageUrl +
                      "</img>" +
                      "</a>" +
                      "<p></p>" +
                      "Plot: " +
                      plot.registeredName +
                      " #" +
                      plot.plotNumber +
                      "<p></p>" +
                      "Date of birth: " +
                      personDateOfBirths[btnNumber] +
                      "<p></p>" +
                      "Date of death: " +
                      personDateOfDeaths[btnNumber] +
                      "<p></p>" +
                      "<button id='back'>&#8592</button>"
                  );
                } else {
                  const personImageUrl =
                    "<img src='images/default-dp.png' width='200' height='200'}>";
                  infowindow1.setContent(
                    "<p></p>" +
                      "<h2>" +
                      "<b>" +
                      aLink +
                      personNames[btnNumber] +
                      "</a></b></h2>" +
                      "<p></p>" +
                      aLink +
                      personImageUrl +
                      "</img>" +
                      "</a>" +
                      "<p></p>" +
                      "Plot: " +
                      plot.registeredName +
                      " #" +
                      plot.plotNumber +
                      "<p></p>" +
                      "Date of birth: " +
                      personDateOfBirths[btnNumber] +
                      "<p></p>" +
                      "Date of death: " +
                      personDateOfDeaths[btnNumber] +
                      "<p></p>" +
                      "<button id='back'>&#8592</button>"
                  );
                }
              });
            });

            infowindow1.setPosition(point);
            infowindow1.open(map);
          }
        });
      });

      google.maps.event.addListener(infowindow1, "domready", () => {
        const back = document.getElementById("back");
        back?.addEventListener("click", () => {
          infowindow1.close();
        });
      });

      polygon.addListener("mouseout", () => {
        infowindow.close();
      });

      return polygonMap.set(plot.plotNumber, polygon);
    }, new Map<number, google.maps.Polygon>());

    setPolygonsByNumber(polygons);

    return () => polygons.forEach((polygon) => polygon.setMap(null));
  }, [map, plots, plotColour]);

  // Highlight anniversary graveyard plots
  useEffect(() => {
    const matchedPlots = getAnniversaryPlots(plots);
    // console.log(matchedPlots)
    if (matchedPlots) {
      matchedPlots.forEach((plot) => {
        // console.log(plot)
        if (plot) {
          const selectedPolygon = polygonsByNumber?.get(plot.plotNumber);
          selectedPolygon?.setOptions({ fillColor: "#7A49FF" });
        }
      });
    }
  }, [plots, polygonsByNumber]);

  // Highlight anniversary graveyard plots
  useEffect(() => {
    const matchedPlots = getAnniversaryPlots(plots);
    // console.log(matchedPlots)
    if (matchedPlots) {
      matchedPlots.forEach((plot) => {
        // console.log(plot)
        if (plot) {
          const selectedPolygon = polygonsByNumber?.get(plot.plotNumber);
          selectedPolygon?.setOptions({ fillColor: "#7A49FF" });
        }
      });
    }
  }, [plots, polygonsByNumber]);

  // Initialise click listeners
  useEffect(() => {
    if (polygonsByNumber) {
      const listeners = Array.from(polygonsByNumber.entries()).map(
        ([number, polygon]) => {
          return polygon.addListener("click", () => onClick(number));
        }
      );
      return () => listeners.forEach((listener) => listener.remove());
    }
  }, [polygonsByNumber, onClick]);

  // Selected plot marker
  const selectedPlotMarker = useMemo(() => new google.maps.Marker(), []);

  useEffect(() => {
    if (selectedPlot) {
      const coordinates = averageCoordinates(selectedPlot.coordinates);

      selectedPlotMarker.setPosition(coordinates);

      map?.setCenter(coordinates);

      if (!selectedPlotMarker.getMap() && map) {
        selectedPlotMarker.setMap(map);
      }
    } else {
      selectedPlotMarker.setMap(null);
    }
  }, [map, selectedPlot, selectedPlotMarker]);

  // Geolocation marker
  const geolocationMarker = useMemo(
    () =>
      new google.maps.Marker({
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: "#4285F4",
          fillOpacity: 1,
          strokeColor: "#fff",
          strokeWeight: 3,
          scale: 10,
        },
      }),
    []
  );

  useEffect(() => {
    if (showLocation) {
      const watchId = navigator.geolocation.watchPosition((position) => {
        geolocationMarker.setPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });

        if (!geolocationMarker.getMap() && map) {
          geolocationMarker.setMap(map);
        }

        return () => navigator.geolocation.clearWatch(watchId);
      });
    } else {
      geolocationMarker.setMap(null);
    }
  }, [map, geolocationMarker, showLocation]);

  return <div ref={mapRef} className={className} data-testid="map" />;
};

export default InteractiveMap;
