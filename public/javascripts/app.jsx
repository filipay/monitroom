var LineChart = rd3.LineChart;
var DeviceRow = React.createClass({
  lastSeen : function(timestamp) {
    var second = 1000;
    var minute = 60 * second;
    var hour = 60 * minute;
    var day = 24 * hour;

    var diff = Date.now() - timestamp;

    if (diff <= 59 * second) return Math.floor(diff/second) + " seconds ago";
    if (diff <= 59 * minute) return Math.floor(diff/minute) + " minutes ago";
    if (diff <= 23 * hour) return Math.floor(diff/hour) + " hours ago";

    return Math.floor(diff/day) + " days ago";
  },

  handleOnClick: function() {
    console.log(this.props.device);
  },

  render: function () {
    return (
    <tr onClick={this.handleOnClick}>
      <td>{this.props.num}</td>
      <td>{this.props.device.name}</td>
      <td>{this.props.device.ip}</td>
      <td>{this.props.device.mac_addr}</td>
      <td>{this.props.device.vendor}</td>
      <td>{this.lastSeen(this.props.device.timestamps.end)}</td>
    </tr>)
  },
});

var DeviceTable = React.createClass({
  getInitialState: function () {
    return {
      data : [],
      isLoading: true
    };
  },
  componentWillMount: function () {
    $.get(this.props.url, function(data) {
      this.setState({ data : data , isLoading : false });
    }.bind(this));
  },

  render: function () {
    if (this.state.isLoading) return <Loading />
    var rows = [];
    var index = 0;
    this.state.data.forEach(function(device) {
      rows.push(<DeviceRow key={device.mac_addr} device={device} num={index}/>);
      index++;
    });
    return (
      <div className="table-responsive">
      <h2 className="sub-header">{this.props.name}</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>IP</th>
              <th>MAC Address</th>
              <th>Vendor</th>
              <th>Last Seen</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>

    );
  }
});

var Loading = React.createClass({
  render: function () {
    return (
      <h1>Loading..</h1>
    )
  }
});

var Chart = React.createClass({
  getInitialState: function () {
    return { data: [] };
  },
  constructUrl: function() {
    var date = new Date();
    var fromInHours = this.props.query.from / 24.0;
    date.setDate(date.getDate() - fromInHours);
    return this.props.url
      + "?from=" + date
      + "&limit=" + this.props.query.limit;
  },
  componentWillMount: function () {
    $.get(this.constructUrl(), function(results) {
      this.setState({ data : this.props.converter(results) });
    }.bind(this));
  },
  render: function() {
   return  (
     <div>
       <h2 className="sub-header">{this.props.name}</h2>
       <LineChart
           legend={true}
           data={this.state.data}
           width='100%'
           height={400}
           viewBoxObject={{
             x: 0,
             y: 0,
             width: 800,
             height: 400
           }}
           yAxisLabel={this.props.name}
           domain={{y: [0,]}}
           xAxisLabel="Date"
           gridHorizontal={true}
       />
    </div>
    )
  }
});


var App = React.createClass({
  render: function() {
    return (
      <div>
        <h1 className="page-header">Dashboard</h1>
        <DeviceTable name="Devices" url="/api/devices/live"/>
        <Chart url="/api/devices" name="# of Devices" query={{
            from: 5,
            limit: 10000
          }} converter={sum_devices}
        />
        <Chart url="/api/cpu" name="CPU" query={{
            from: 5,
            limit: 1000
          }} converter={cpu_convert}
        />
        <Chart name="Speed" url="/api/speed" query={{
          from: 5,
          limit: 1000
        }} converter={speed_convert}
        />
      </div>
    )
  }
});

ReactDOM.render(
  <App/>,
  document.getElementById('overview-content')
)

function cpu_convert(response) {
  var results = [];
  var series_1min = {
    name: '1 Minute Metric',
    values : response.map(function(d) {
      return { x : new Date(d.data.timestamp), y: d.data._1min };
    })
  };
  var series_5min = {
    name: '5 Minute Metric',
    values : response.map(function(d) {
      return {  x : new Date(d.data.timestamp), y: d.data._5min};
    })
  };
  var series_15min = {
    name: '15 Minute Metric',
    values : response.map(function(d) {
      return { x : new Date(d.data.timestamp), y: d.data._15min };
    })
  };
  results.push(series_1min);
  results.push(series_5min);
  results.push(series_15min);
  return results;
};

function speed_convert (response) {
  var results = [];
  var series_dl = {
    name: 'Download',
    values: response.map(function(d){
      return { x: new Date(d.data.timestamp), y: d.data.download}
    })
  };
  var series_ul = {
    name: 'Upload',
    values: response.map(function(d){
      return { x: new Date(d.data.timestamp), y: d.data.upload}
    })
  };
  results.push(series_dl);
  results.push(series_ul);
  return results;
}

function sum_devices (response) {
  var results = [];
  var series_sum_devices = {
    name: '# of devices',
    values: response.map(function(d){
      return { x: new Date(d.data.timestamp), y: d.data.devices.length || 0 }
    })
  };
  results.push(series_sum_devices);
  return results;
}
