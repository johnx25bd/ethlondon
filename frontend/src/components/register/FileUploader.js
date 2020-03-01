import React, {useMemo, useCallback}  from 'react';
import {useDropzone} from 'react-dropzone';
import onPolygonDrop from './onPolygonDrop'
import * as turfHelpers from "@turf/helpers"
import  booleanContains from "@turf/boolean-contains"

console.log(turfHelpers);
console.log(booleanContains);

// styling
const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
  };

  const activeStyle = {
    borderColor: '#2196f3'
  };

  const acceptStyle = {
    borderColor: '#00e676'
  };

  const rejectStyle = {
    borderColor: '#ff1744'
  };

// dropzone component
export default function FileUploader(props) {

    const onDrop = useCallback(acceptedFiles => {
        // Do something with the files
        const reader = new FileReader();
        reader.onload = () => {

          let geojson = JSON.parse(reader.result),
            turfRegisteredZone, turfPoly;

          if (geojson.type == 'Feature' && geojson.geometry.type == "Polygon") {
            turfPoly = turfHelpers.polygon(geojson.geometry.coordinates);
          }
          if (geojson.type == 'MultiPolygon') {
            turfPoly = turfHelpers.multiPolygon(geojson.geometry.coordinates);
          } else if (geojson.type == 'Polygon') {
            turfPoly = turfHelpers.polygon(geojson.geometry.coordinates);
          }

          props.registeredZones.forEach(function (registeredZone) {

            if (registeredZone.geometry.type == 'MultiPolygon') {
              turfRegisteredZone = turfHelpers.multiPolygon(registeredZone.geometry.coordinates);
            } else if (registeredZone.geometry.type == 'Polygon') {
              turfRegisteredZone = turfHelpers.polygon(registeredZone.geometry.coordinates);
            }

            // Error waiting to happen - zones within zones ...
            if (booleanContains(turfRegisteredZone, turfPoly)) {
              geojson.properties.tested = true;
              geojson.properties.parent = {
                address: registeredZone.properties.address,
                iso3:  registeredZone.properties.ISO3
              }
              props.setZoneToRegister(geojson);
            }
          });


            geojson.properties.tested = true;
            geojson.properties.parent = null;

            props.setZoneToRegister(geojson);

            props.addPolygonToMap(geojson);
            // onPolygonDrop(geojson)
        }

        reader.readAsBinaryString(acceptedFiles[0]);

        return "Something?";
    }, [])

    const {
        acceptedFiles,
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
        // geojon
      } = useDropzone({accept: '.json', onDrop : onDrop});

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isDragActive,
        isDragReject
    ]);

    // callback function on drop


    const acceptedFilesItems = acceptedFiles.map(file => (
        <li className = "text-success" style = {{"fontSize":"12pt"}} key={file.path}>
        {file.path} - {file.size} bytes
        </li>
    ));

    return (
        <section className="container">
        <div {...getRootProps({style})}>
            <input {...getInputProps()} />
            <p>Drag and drop a Geojson file here, or click to select.</p>
            <em>(Only *.json files will be accepted)</em>
        </div>
        <aside>
            <p>Accepted GeoJSON:</p>
            <ul>
            {acceptedFilesItems}
            </ul>
        </aside>
        </section>
    );
}
