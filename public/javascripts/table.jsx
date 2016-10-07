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


ReactDOM.render(
  <DeviceTable url="/api/devices/all"/>,
  document.getElementById('device-table')
)
