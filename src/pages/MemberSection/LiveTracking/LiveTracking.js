import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const MapComponent = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
    const params = useParams();

  const [locations, setLocations] = useState([]);
  const requestId = params.id;

  useEffect(() => {
    const loadMap = () => {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: 0, lng: 0 }, // مركز الخريطة مؤقت
        zoom: 2,
      });
    };

    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDL3SK6xKW24sNWVV9LUfc64Z1AcGyLchc`;
      script.async = true;
      script.defer = true;
      script.onload = loadMap;
      document.head.appendChild(script);
    } else {
      loadMap();
    }
  }, []);

  useEffect(() => {
    if (!mapInstance.current || !requestId) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(`http://147.79.101.225:8888/admin/location/6800d1640d9d0f8d5e358729`);
        const data = res.data.locations.location;

        setLocations(data);

        // رسم النقاط
        data.forEach((loc, index) => {
            const marker = new window.google.maps.Marker({
              position: {
                lat: loc.latitude + index * 0.00005, // نغير الموقع شوية
                lng: loc.longitude + index * 0.00005,
              },
              map: mapInstance.current,
              title: `Location ID: ${loc._id}`,
            });
          });
          

        // توسيط الخريطة على أول نقطة
        if (data.length > 0) {
          mapInstance.current.setCenter({
            lat: data[0].latitude,
            lng: data[0].longitude,
          });
          mapInstance.current.setZoom(12);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchData();
  }, [requestId]);

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default MapComponent;
