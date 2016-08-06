var Modal = ReactBootstrap.Modal;
var FormGroup = ReactBootstrap.FormGroup;
var FormControl = ReactBootstrap.FormControl;
var ControlLabel = ReactBootstrap.ControlLabel;
var Button = ReactBootstrap.Button;
var Table = ReactBootstrap.Table;
var Panel = ReactBootstrap.Panel;

var Title = React.createClass({
  render: function() {
    return (
      <h1>
        Address Book
      </h1>
    );
  }
});


var Person = React.createClass({
  render: function() {
    return (
        <tr>
            <td>{this.props.person.firstName}</td>
            <td>{this.props.person.lastName}</td>
            <td>{this.props.person.email}</td>
            <td><Button bsStyle="danger" bsClass="close" onClick={this.deletePerson} ><span>x</span></Button></td>
        </tr>
    );
  },
  
  deletePerson: function() {
      $.ajax({
      url:  "/proxy/api/person/" + this.props.person.id,
      dataType: 'json',
      type: 'DELETE',
      success: function(data) {
        this.props.refreshPeople();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  }
});

var PeopleList = React.createClass({
 getInitialState() {
    return { people: [] };
  },
   componentDidMount: function() {
    this.loadPeopleFromServer();
  },
  
  loadPeopleFromServer: function() {
    $.ajax({
      url:  "/proxy/api/company/" + this.props.company.name + "/people",
      dataType: 'json',
      success: function(data) {
        this.setState({people: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  render: function() {
    var refreshPeople = this.loadPeopleFromServer;
    var people = this.state.people.map(function(person) {
        return (
            <Person person={person} refreshPeople={refreshPeople}/>
      );
    });
  
    return (
        <div>
            <h4>People</h4>
            <Table>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {people}
                </tbody>
            </Table>
            <AddPerson company={this.props.company} refreshPeople={this.loadPeopleFromServer}/>
      </div>
    );
  }
});

var AddPerson = React.createClass({
 getInitialState() {
    return { show: false };
  },
  
  handleFirstNameChange: function(e) {
    this.setState({firstName: e.target.value});
  },
  handleLastNameChange: function(e) {
    this.setState({lastName: e.target.value});
  },
  handleEmailNameChange: function(e) {
    this.setState({email: e.target.value});
  },


  render: function() {
    let close = () => this.setState({ showModal: false});
  
    return (
        <div>
            <Button  bsStyle="success" onClick={() => this.setState({ showModal: true})}>
                Add Person
            </Button>
            
            <Modal show={this.state.showModal} onHide={close}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Add Person
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <form onSubmit={this.addPerson}>
                    <FormGroup>
                        <ControlLabel>First Name</ControlLabel>
                        <FormControl type="text" onChange={this.handleFirstNameChange}/>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Last Name</ControlLabel>
                        <FormControl type="text" onChange={this.handleLastNameChange}/>
                    </FormGroup>
                     <FormGroup>
                        <ControlLabel>Phone number</ControlLabel>
                        <FormControl type="text" onChange={this.handleEmailChange}/>
                    </FormGroup>
                    <Button bsStyle="success" type="submit">
                        Save
                    </Button>
                </form>
                </Modal.Body>
            </Modal>
        </div>
    );
  },
  
  addPerson: function(e) {
    e.preventDefault();
    var data = {
            firstName : this.state.firstName,
            lastName : this.state.lastName,
            email : this.state.email,
            company : this.props.company.name};
     $.ajax({
        contentType: "application/json" ,
        type: 'POST',
        url: '/proxy/api/person',
        data: JSON.stringify(data),
      success: function(data) {
        this.setState({ showModal: false});
        this.props.refreshPeople();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  }
});

var Company = React.createClass({
  render: function() {
    return (
      <div>
        <Panel header={this.props.company.name}  bsStyle="primary">
            Phone number - {this.props.company.phoneNumber}
            <Button bsStyle="danger" bsClass="close" onClick={this.deleteCompany} ><span>x</span></Button>
            <PeopleList company={this.props.company} />
        </Panel>
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
        <h2>Companies</h2>
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
            <Button bsStyle="success" onClick={() => this.setState({ showModal: true})}>
                Add Company
            </Button>
            
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
                    <Button bsStyle="success" type="submit">
                        Save
                    </Button>
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