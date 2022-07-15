import React, { useEffect, useMemo, useRef, useState } from "react";
import { IPlot, IPerson } from "../../../types/schema";
import averageCoordinates from "./utils/averageCoordinates";
import getAnniversaryPlots from "./utils/getAnniversaryPlots";
import { getCookie } from "typescript-cookie";

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
    const polygons = plots.reduce((polygonMap, plot) => {
      const polygon = new google.maps.Polygon({
        paths: plot.coordinates,
        strokeColor: "#428bca",
        strokeOpacity: 0.6,
        strokeWeight: 2,
        fillColor: "#428bca",
        fillOpacity: 0.2,
      });
      polygon.setMap(map ?? null);

      const infowindow = new google.maps.InfoWindow({
        content:
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
          plot.buried.map((person: IPerson) => "<p></p>" + person.fullName),
      });

      const point = averageCoordinates(plot.coordinates);

      polygon.addListener("mouseover", () => {
        infowindow.setPosition(point);
        infowindow.open(map);
      });
      polygon.addListener("mouseout", () => {
        infowindow.close();
      });

      return polygonMap.set(plot.plotNumber, polygon);
    }, new Map<number, google.maps.Polygon>());

    setPolygonsByNumber(polygons);

    return () => polygons.forEach((polygon) => polygon.setMap(null));
  }, [map, plots]);

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
