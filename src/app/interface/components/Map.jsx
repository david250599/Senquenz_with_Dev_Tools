import React    from 'react';
import               '../../../css/component/Map.css';
// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from '!mapbox-gl';




export class Map extends React.PureComponent {
    constructor(props) {
        super(props);
        mapboxgl.accessToken = props.mapToken;
        this.mapContainer = React.createRef();
    }

    componentDidMount() {
        this.map =      new mapboxgl.Map({
            container:  this.mapContainer.current,
            style:      this.props.mapStyle,
            center:     [this.props.currentLocation.lng, this.props.currentLocation.lat],
            zoom:       this.props.currentLocation.zoom
        });


        //Move on the map
        this.map.on('move', () => {
            this.props.setLocation(
                this.map.getCenter().lat,
                this.map.getCenter().lng,
                this.map.getZoom()
            );
        });

        this.props.getMap(this.map);

    }

    componentWillUnmount() {
        this.map.remove();
    }

    render() {
        return(
            <div className = {this.props.className} id = {this.props.id}>
                <div className = "marker"/>
                <p className = "mapInfo"> {this.props.currentLocation.lng.toFixed(2) + ', ' +
                     this.props.currentLocation.lat.toFixed(2) + ', '+
                     this.props.currentLocation.zoom.toFixed(2)}
                </p>
                <div ref = {this.mapContainer} className = "mapContainer" />
            </div>

        )
    }
}