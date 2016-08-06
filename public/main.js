var Modal = ReactBootstrap.Modal;
var FormGroup = ReactBootstrap.FormGroup;
var FormControl = ReactBootstrap.FormControl;
var ControlLabel = ReactBootstrap.ControlLabel;

var Title = React.createClass({
  render: function() {
    return (
      <h1>
        Address Book
      </h1>
    );
  }
});

var Company = React.createClass({
  render: function() {
    return (
      <div>
        <h6>{this.props.company.name}</h6> 
        Phone number - {this.props.company.phoneNumber}
        <button onClick={this.deleteCompany}>Delete</button>
      </div>
    );
  },
  
  deleteCompany: function() {
      $.ajax({
      url:  "/proxy/api/company/" + this.props.company.name,
      dataType: 'json',
      type: 'DELETE',
      success: function(data) {
        this.props.refreshCompanies();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  }
});

var Companies = React.createClass({
 getInitialState() {
    return { data: [] };
  },
  componentDidMount: function() {
    this.loadCompaniesFromServer();
  },

    loadCompaniesFromServer: function() {
    $.ajax({
      url:  "/proxy/api/company/all",
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  render: function() {
    var refreshCompanies = this.loadCompaniesFromServer;
    var companyNodes = this.state.data.map(function(company) {
        return (
        <Company company={company} refreshCompanies={refreshCompanies}/>
      );
    });
    return (
      <div>
        {companyNodes}
        
        <AddCompany refreshCompanies={refreshCompanies}/>
      </div>
    );
  }
});

var AddCompany = React.createClass({
 getInitialState() {
    return { show: false };
  },
  
  handleNameChange: function(e) {
    this.setState({name: e.target.value});
  },
  handlePhoneNumberChange: function(e) {
    this.setState({phoneNumber: e.target.value});
  },

  render: function() {
    let close = () => this.setState({ showModal: false});
  
    return (
        <div>
            <button onClick={() => this.setState({ showModal: true})}>
                Add Company
            </button>
            
            <Modal show={this.state.showModal} onHide={close}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Add Company
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <form onSubmit={this.addCompany}>
                    <FormGroup>
                        <ControlLabel>Name</ControlLabel>
                        <FormControl type="text" onChange={this.handleNameChange}/>
                    </FormGroup>
                     <FormGroup>
                        <ControlLabel>Phone number</ControlLabel>
                        <FormControl type="text" onChange={this.handlePhoneNumberChange}/>
                    </FormGroup>
                    <button type="submit">
                        Save
                    </button>
                </form>
                </Modal.Body>
            </Modal>
        </div>
    );
  },
  
  addCompany: function(e) {
    e.preventDefault();
    var data = {name : this.state.name, phoneNumber :this.state.phoneNumber};
     $.ajax({
        contentType: "application/json" ,
        type: 'POST',
        url: '/proxy/api/company',
        data: JSON.stringify(data),
      success: function(data) {
        this.setState({ showModal: false});
        this.props.refreshCompanies();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  }
});


ReactDOM.render(
  <div>
    <Title />
    <Companies/>
  </div>,
  document.getElementById('root')
);