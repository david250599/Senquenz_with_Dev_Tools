import React from 'react';
import '../../css/Map.css';
// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from '!mapbox-gl';


mapboxgl.accessToken = 'pk.eyJ1IjoiZGFpdmQta2FpcGYiLCJhIjoiY2tvb21qamlzMGNtajJybnUwM2gwdGY1ZiJ9.aKH_sjgP0MYLTaGIWV_wPQ';

export class Map extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            lng: 10.9,
            lat: 48.365,
            zoom: 15
        };
        this.mapContainer = React.createRef();
    }

    componentDidMount() {

        const {lng, lat, zoom} = this.state;
        this.map = new mapboxgl.Map({
            container: this.mapContainer.current,
            style: 'mapbox://styles/mapbox/dark-v10',
            center: [lng, lat],
            zoom: zoom
        });


        //Move on the map
        this.map.on('move', () => {
            this.setState({
                lng: this.map.getCenter().lng,
                lat: this.map.getCenter().lat,
                zoom: this.map.getZoom()
            });
        });

    }

    componentWillUnmount() {
        this.map.remove();
    }


    getUserLocation(){
        navigator.geolocation.getCurrentPosition(position => {
            this.map.setCenter([position.coords.longitude, position.coords.latitude]);
            this.map.setZoom(15);

            this.setState({
                lng: position.coords.longitude,
                lat: position.coords.latitude
            });
        });
    }

    async getGeoData(){
        let query = 'https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2,mapbox.mapbox-streets-v8/tilequery/' + this.state.lng + ',' + this.state.lat + '.json?' +
            'radius=1000&limit=50&dedupe&access_token=' + mapboxgl.accessToken;

        let response = await fetch(query);

        if(response.ok){
            let data = await response.json();
            let allFeatures = data.features
            console.log(allFeatures);

            let elevations = [];

            for(let i = 0; i<allFeatures.length; i++){
                elevations.push(allFeatures[i].properties.ele);
            }
            console.log(elevations);

        }else{
            alert('HTTP-Error: ' + response.status + ', Could not load geodata');
        }

    }



    render() {
        return(
            <div className="map">
                <button
                    className="getDataButton"
                    name="getData"
                    type="button"
                    onClick={() => this.getGeoData()}>Get Data</button>
                <div className="marker"/>
                <button
                    className="mapButton"
                    name="getLocation"
                    type="button"
                    onClick={() => this.getUserLocation()}>Get Location</button>
                <div ref={this.mapContainer} className="mapContainer" />
                <p>Longitude: {this.state.lng} | Latitude: {this.state.lat} | Zoom: {this.state.zoom}</p>
            </div>

        )
    }
}