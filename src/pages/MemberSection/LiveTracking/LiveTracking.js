import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { io } from 'socket.io-client';
import './MapComponent.css';

const MapComponent = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const polylineRef = useRef(null);
  const [locations, setLocations] = useState([]);
  const params = useParams();
  const requestId = params.id;

  useEffect(() => {
    // تهيئة الخريطة مع طبقة عالية الدقة
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([31.2414354, 29.9672746], 20);

      // استخدام طبقة خرائط عالية الدقة
      L.tileLayer('https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=6fbc592af9e64e50beed74dd79f8dc35', {
        attribution: '&copy; <a href="https://www.thunderforest.com/">Thunderforest</a> contributors',
        maxZoom: 20 ,
        
      }).addTo(mapInstance.current);
    }

    const fetchData = async () => {
      try {
        const res = await axios.get(`http://147.79.101.225:8888/admin/location/6800d1640d9d0f8d5e358729`);
        const data = res.data.locations.location;
        if (!Array.isArray(data) || data.length === 0) return;

        setLocations(data);
        drawMarkersAndPolyline(data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    const drawMarkersAndPolyline = (data) => {
      // تنظيف العناصر القديمة
      markersRef.current.forEach(marker => mapInstance.current.removeLayer(marker));
      markersRef.current = [];

      if (polylineRef.current) {
        mapInstance.current.removeLayer(polylineRef.current);
      }

      const latlngs = data.map(loc => {
        return [loc.latitude, loc.longitude];
      });

      const createCircleIcon = (color = '#3388ff', number = '') => {
        return L.divIcon({
          className: 'custom-circle-marker',
          html: `
            <div style="
              background: ${color};
              width: 24px;
              height: 24px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              border: 2px solid white;
              box-shadow: 0 0 5px rgba(0,0,0,0.3);
            ">
              ${number}
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });
      };
      // إضافة الماركرات
      // إضافة الماركرات الدائرية
      latlngs.forEach((latlng, index) => {
        const marker = L.marker(latlng, {
          icon: createCircleIcon('red', index + 1)
        })
          .addTo(mapInstance.current)
          .bindPopup(`
    <div style="text-align: right; direction: rtl;">
      <strong>النقطة ${index + 1}</strong><br>
      خط العرض: ${latlng[0].toFixed(6)}<br>
      خط الطول: ${latlng[1].toFixed(6)}
    </div>
  `);

        markersRef.current.push(marker);
      });;

      polylineRef.current = L.polyline(latlngs, {
        color: 'green',
        weight: 5,
        opacity: 0.8,
        lineJoin: 'round'
      }).addTo(mapInstance.current);

      mapInstance.current.fitBounds(polylineRef.current.getBounds(), {
        padding: [50, 50],
        maxZoom: 18
      });
    };

    fetchData();

    const socket = io('http://147.79.101.225:8888');
    socket.on('locationUpdate', (newLocation) => {
      setLocations(prev => {
        const updated = [...prev, newLocation];
        drawMarkersAndPolyline(updated);
        return updated;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [requestId]);

  return <div ref={mapRef} className="leaflet-map" style={{ height: '100vh', width: '100%' }} />;
};

export default MapComponent;