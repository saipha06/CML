import '../App.css';
import React from "react";
import { Autocomplete } from '@material-ui/lab';
import { TextField} from '@material-ui/core';
import {Modal,Button, Tabs,Tab} from 'react-bootstrap';
import Navigationbar from './navBar';
class EnquiryForm extends React.Component {
  constructor(props)
  {
    
    super(props);
    
    
    this.sNo = 1;
    this.steelData=[{ SNo: this.sNo, Material: "", description: "",dimension:"", length: "", Grade: "IS: 2062" ,
    Indent:"", Make:"", Qty:"", TW:""}];
    this.Id = 1;
    this.state = {
      selectedTab:1,
      SteelData: [{ SNo: this.sNo, Material: "", description: "",dimension:"", length: "", Grade: "IS: 2062" ,
       Indent:"", Make:"", Qty:"", TW:""}],
      SelectedVendors:[],
       MasterData:{
        MastersteelData:[],
        MasterVendors:[]
       },
       filteredContent:[],
       OpenDialogue:false,
       result:{
         status:"Failed",
         message:"An error Occured."
       },
       AddedVendors:[{Id:this.Id,name:"",email:""}],
       filteredVendorsContent:[],
       masterEnquiryData:[],
       selectedEnquiryData:{},
       preview:false,
       RData:{}
       

    }
    
    this.handlePreview = this.handlePreview.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleViewEditEnquiryForm = this.handleViewEditEnquiryForm.bind(this);
    this.handleChange=this.handleChange.bind(this);
    this.addNewRow = this.addNewRow.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clickOnDelete = this.clickOnDelete.bind(this);

    this.handleFilteredContent = this.handleFilteredContent.bind(this);
    this.performValidation = this.performValidation.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleVendorChange = this.handleVendorChange.bind(this)
    this.clickOnDeleteVendor = this.clickOnDeleteVendor.bind(this);
    this.handleVendorsFilteredContent = this.handleVendorsFilteredContent.bind(this);
    this.addNewVendorRow = this.addNewVendorRow.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
    this.handleUseEnquiry = this.handleUseEnquiry.bind(this);
    this.handleSendMail = this.handleSendMail.bind(this);

  }

  handleUseEnquiry = () =>{
    this.setState({
      SteelData:JSON.parse(this.state.RData.InputJSON).ExcelData,
      AddedVendors:JSON.parse(this.state.RData.InputJSON).VendorData
      

    },()=>{
      this.setState({
        selectedTab:1
      },()=>{
       
      })
    })
  }

  handleSendMail = () => {
    var toAddr = [];
    JSON.parse(this.state.RData.InputJSON).VendorData.forEach(element => {
      toAddr.push(element.email)
    });

    console.log(toAddr);
    fetch('http://localhost:3000/sendMail',{
      method:"post",
      body:JSON.stringify({filePath:this.state.selectedEnquiryData.FilePath,toAddress:toAddr.join(';'),templateName:""}),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
			.then(res => res.json())
    .then((results)=>{
      if(results.message === "Success")
      {
        this.setState({
          OpenDialogue:true,
          result:{
            status:"Success",
            message:"Mail has been generated successfully."
          }
        })
      }
      else
      {
        this.setState({
          OpenDialogue:true
        })
      }
      
    })
    .catch((err)=>{
      console.error(err);
      alert(err.message)
    })
  }

  handleViewEditEnquiryForm = (e) =>{
    let id = parseInt(e.target.value);
    this.steelData = JSON.parse(JSON.parse(JSON.stringify(this.state.masterEnquiryData.filter((enq)=>enq.Id===id)[0])).InputJSON).ExcelData;
    this.setState({
      RData: JSON.parse(JSON.stringify(this.state.masterEnquiryData.filter((enq)=>enq.Id===id)[0])),
      selectedEnquiryData:this.state.masterEnquiryData.filter((enq)=>enq.Id===id)[0]
      
    })
  }

  handlePreview = () =>{
    let isValid = this.performValidation();
      if(!isValid)
      {
        this.setState({
          OpenDialogue:true,
          result:{
            message:"Please fill all the fields before submitting data."
          }
        })
      }
      
      else
      { 
        this.setState({
          preview:true
        })
      }
    
  }

  handleEdit = () => {
    this.setState({
      preview:false
    })
  }

  handleDownload = () =>{
    fetch('http://localhost:3000/Download',{
      method:"post",
      body:JSON.stringify({filePath:this.state.selectedEnquiryData.FilePath}),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
			.then(response => {
				response.blob().then(blob => {
					let url = window.URL.createObjectURL(blob);
					let a = document.createElement('a');
					a.href = url;
					a.download = this.state.selectedEnquiryData.Name;
					a.click();
        });

        this.setState({
          OpenDialogue:true,
          result:{
            status:"Download Success",
            message:this.state.selectedEnquiryData.Name+" downloaded successfully."
          }
        })
      });
  }



  handleClose = () => {
    this.setState({
      OpenDialogue:false
    })
    if(this.state.result.status==="Success")
    {
      window.location.reload();
    }
    
  };
  
  handleChange = (e) => {
    if(e.target.name==="Material")
    {
      this.handleFilteredContent(e)
    }
    if (["Material", "description","dimension", "length", "Grade", "Indent", "Make", "Qty", "TW"].includes(e.target.name)) {
        let SteelData = [...this.state.SteelData]
        SteelData[e.target.dataset.id][e.target.name] = e.target.value;
    } else {
        this.setState({ [e.target.name]: e.target.value })
    }
      
  };

  handleVendorsFilteredContent = (e) =>{
    if(e.target.name==="name")
    {
      let str = e.target.value.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp('^' + str, 'i');
        let filteredData =  this.state.MasterData.MasterVendors.filter(data => regex.test(data.VendorName));
        this.setState({
          filteredVendorsContent:filteredData
        })}
    };

  addNewVendorRow = (e) => {
    this.Id = this.Id +1;
      this.setState((prevState) => ({
        AddedVendors: [...prevState.AddedVendors, { Id: this.Id, name: "", email: "" }]
      }));
      
  }

  handleVendorChange = (e) => {
    if(e.target.name==="name")
    {
      this.handleVendorsFilteredContent(e)
    }
    if (["name", "email"].includes(e.target.name)) {
        let vendorData = [...this.state.AddedVendors]
        vendorData[e.target.dataset.id][e.target.name] = e.target.value;
    } else {
        this.setState({ [e.target.name]: e.target.value })
    }
      
  }

  clickOnDeleteVendor(record) {
    this.setState({
      AddedVendors: this.state.AddedVendors.filter(r => r !== record)
    });
}

  handleFilteredContent=(e)=>{
    if(this.state.MasterData.MastersteelData.length>0){
      if(e.target.name==="Material"){
        let str = e.target.value.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp('^' + str, 'i');
        let filteredData =  this.state.MasterData.MastersteelData.filter(data => regex.test(data.Name));
        this.setState({
          filteredContent:filteredData
        })}
  
      else if(e.target.name==="description")
      {
        let str = e.target.value.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp('^' + str, 'i');
        let filteredData =  this.state.filteredContent.filter(data => regex.test(data.Dimension1));
        this.setState({
          filteredContent:filteredData
        })}
    }
  }
    
  
  
  addNewRow = (e) => {
    this.sNo = this.sNo +1;
      this.setState((prevState) => ({
        SteelData: [...prevState.SteelData, { SNo: this.sNo, Material: "", description: "",dimension:"", length: "", Grade: "IS: 2062" ,
           Indent:"", Make:"", Qty:"", TW:"" }],
      }));
      
      this.steelData.push({ SNo: this.sNo, Material: "", description: "",dimension:"", length: "", Grade: "IS: 2062" ,
      Indent:"", Make:"", Qty:"", TW:""});
  }
  

  deleteRow = (index) => {
      this.setState({
        SteelData: this.state.SteelData.filter((s, sindex) => index !== sindex),
      });
      this.steelData.splice(index,1);
  }
  performValidation = () =>{
    let isValid = true;
    this.state.SteelData.forEach(element => {
      if(element.Material==="" || element.description==="" || element.dimension==="" || element.length==="" || element.Indent==="" || element.Grade===""||element.Make==="" || element.Make==="NA" ||element.Qty===""||element.TW===""){
        isValid=false;
      }
    });
    if(this.state.AddedVendors.length<1){
      isValid=false;
    }
    else{
      this.state.AddedVendors.forEach((element)=>{
        if(element.name==="" || element.email===""){
          isValid=false;
        }
      })
    }
    return isValid;
  }
  handleSubmit = () => {
      let isValid = this.performValidation();
      if(!isValid)
      {
        this.setState({
          OpenDialogue:true,
          result:{
            message:"Please fill all the fields before submitting data."
          }
        })
      }
      
      else
      {
        let excelData = this.state.SteelData;
        let vendors = this.state.AddedVendors;
        let inputData = {ExcelData:excelData,Vendors:vendors}
        console.log(inputData);
        fetch("http://localhost:3000/PrepareExcel",
        {
          method:"post",
          body:JSON.stringify(inputData),
          headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
        }).then(res => res.json())
        .then((results)=>{
          if(results.message === "Success")
          {
            this.setState({
              OpenDialogue:true,
              result:{
                status:"Success",
                message:"A new enqiry from with file name "+results.FileName+" is generated."
              }
            })
          }
          else
          {
            this.setState({
              OpenDialogue:true
            })
          }
          
        })
        .catch((err)=>{
          console.error(err);
          alert(err.message)
        })
      }
}
  clickOnDelete(record) {
      this.setState({
        SteelData: this.state.SteelData.filter(r => r !== record)
      });
  }

  

  componentDidMount(){
    fetch('http://localhost:3000/GetSteelData')
    .then(res => res.json())
          .then((results) => {
            
            this.setState({
              MasterData:{
                MastersteelData:results.result.steelData,
                MasterVendors:results.result.vendors
              }
            })
          })
          .catch((err)=>{
            this.setState({
              MasterData:{
                MastersteelData:[],
                MasterVendors:[]
              }
            })
            console.log(err.message);
          });
    fetch('http://localhost:3000/GetAllEnquiryData')
    .then(res => res.json())
          .then((results) => {
            
            this.setState({
              masterEnquiryData:results.result.masterData
            })
          })
          .catch((err)=>{
            this.setState({
              masterEnquiryData:[]
              
            })
            console.log(err.message);
          })
  }
  render() {
      return (
        <div className="content">
          <Navigationbar id = { this.props.match.params.id}/>
          <Tabs activeKey={this.state.selectedTab} onSelect={key => this.setState({ selectedTab:key })}>
            <Tab eventKey={1} title="New EnquiryForm">
            <div className="row" style={{ marginTop: 20, width: 100 + "%" }}>
              <div className="col-sm-1"></div>
                  <div className="col-sm-10">
                    <div className="card">
                      <div className="card-header text-center" style={{ width: 100 + "%"}}>Enquiry Form</div>
                        
                        <div className="card-body">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className="required" >Material</th>
                                        <th className="required" >Description</th>
                                        <th className="required" >Length</th>
                                        <th className="required" >Grade</th>
                                        <th className="required" >Indent</th>
                                        <th className="required" >Make</th>
                                        <th className="required" >Quantity</th>
                                        <th className="required" >Total Weight</th>
                                    </tr>
                                </thead>
                                <tbody >
                                {
                                  this.state.SteelData.map((data, idx) => {
                                    
                                    
                                    let Material = `Material-${idx}`, description = `description-${idx}`,dimension=`dimension-${idx}`, length = `length-${idx}`, Grade = `Grade-${idx}`,
                                    Indent = `Indent-${idx}`, Make = `Make-${idx}`, Qty = `Qty-${idx}`, TW = `TW-${idx}`
                                    return (
                                      <tr key={data.SNo}>
                                        <td>
                                          
                                          <Autocomplete id={Material} value={data.Material} disabled= {this.state.preview} onInputChange={(event, val) => this.handleChange({target:{name:"Material",value:val,dataset:{id:idx}}})} freeSolo options={[...new Set(this.state.MasterData.MastersteelData.map((option) => option.Name))]}
                                          renderInput={(params) => (
                                            <TextField {...params} name="Material" margin="normal" variant="outlined" />
                                          )}
                                        />
                                        </td>
                                        <tr>
                                        <td>
                                        <Autocomplete id={description} value={data.description} disabled= {this.state.preview} onInputChange={(event, val) => this.handleChange({target:{name:"description",value:val,dataset:{id:idx}}})} freeSolo options={[...new Set(this.state.filteredContent.map((option) => option.Dimension1))]}
                                          renderInput={(params) => (
                                            <TextField {...params} name="description" margin="normal" variant="outlined" />
                                          )}
                                        />
                                        
                                        </td>
                                        
                                        <td>
                                        <Autocomplete id={dimension} value={data.dimension} disabled= {this.state.preview} onInputChange={(event, val) => this.handleChange({target:{name:"dimension",value:val,dataset:{id:idx}}})} freeSolo options={[...new Set(this.state.filteredContent.map((option) => option.Dimension2))]}
                                          renderInput={(params) => (
                                            <TextField {...params} name="dimension" margin="normal" variant="outlined"/>
                                          )}
                                        />
                                        </td>
                                        </tr>
                                        <td>
                                          <input type="text" style={{ width: 85 + "px"}} defaultValue={data.length} disabled={this.state.preview} name="length" data-id={idx} id={length}   onChange={this.handleChange}/>
                                        </td>
                                        <td>
                                          <input type="text" style={{ width: 80 + "px"}} name="Grade"  disabled={true} defaultValue={data.Grade} data-id={idx} />
                                        </td>
                                        <td>
                                          <input type="text"  style={{ width: 85 + "px"}} defaultValue={data.Indent} disabled={this.state.preview} name="Indent" data-id={idx} id={Indent}  onChange={this.handleChange}/>
                                        </td>
                                        <td>
                                          <select name="Make" style ={{width:"unset"}} disabled={this.state.preview} defaultValue={this.steelData[idx].Make} id={Make} data-id={idx}  onChange={this.handleChange}>
                                            <option value="NA">--select--</option>
                                            <option value="Jindal">Jindal</option>
                                            <option value="DILL/RSRM">DILL/RSRM</option>
                                            <option value="ROLLED">ROLLED</option>
                                            <option value="SAIL">SAIL</option>
                                          </select>
                                        </td>
                                        <td>
                                          <input type="text" style={{ width: 80 + "px"}} defaultValue={data.Qty} disabled={this.state.preview} name="Qty" data-id={idx} id={Qty} onChange={this.handleChange}/>
                                        </td>
                                        <td>
                                          <input type="text" style={{ width: 80 + "px"}} disabled={this.state.preview} defaultValue={data.TW} name="TW" data-id={idx} id={TW} onChange={this.handleChange}/>
                                        </td>
                                        <td>
                                          {
                                          idx===0?<span></span>
                                          : <button className="btn btn-danger" disabled={this.state.preview} onClick={(() => this.clickOnDelete(data))} ><i className="fa fa-minus" aria-hidden="true"></i></button>
                                          }
                                        </td>
                                      </tr >
                                    )
                                  })
                                }
                                </tbody>
                                <tfoot>
                                    <tr><td colSpan="4">
                                        <button onClick={this.addNewRow} disabled={this.state.preview} type="button" className="btn btn-primary text-center"><i className="fa fa-plus-circle" aria-hidden="true"></i></button>
                                    </td></tr>
                                </tfoot>
                            </table>
                        </div>
                        
                    </div>
                    
                </div>
                <div className="col-sm-1"></div>
            </div>
            <div className="row" style={{ marginTop: 20, width: 100 + "%" }}>
            <div className="col-sm-1"></div>
            <div className="col-sm-10">
            <div className="card">
            <div className="card-header text-center" style={{ width: 100 + "%"}}>Add Vendors</div>
              <div className="card-body">
                  <table className="table">
                      <thead>
                          <tr>
                              <th className="required" >Name</th>
                              <th className="required" >Email</th>
                          </tr>
                      </thead>
                      <tbody >
                      {
                        this.state.AddedVendors.map((data, idx) => {
                          
                          
                          let name = `name-${idx}`, email = `email-${idx}`
                          return (
                            <tr key={data.Id}>
                              <td>
                                
                                <Autocomplete id={name} value={data.name} disabled={this.state.preview} onInputChange={(event, val) => this.handleVendorChange({target:{name:"name",value:val,dataset:{id:idx}}})} freeSolo options={[...new Set(this.state.MasterData.MasterVendors.map((option) => option.VendorName))]}
                                renderInput={(params) => (
                                  <TextField {...params}  name="name" margin="normal" variant="outlined" />
                                )}
                              />
                              </td>
                              
                              <td>
                              <Autocomplete id={email} value={data.email} disabled={this.state.preview} onInputChange={(event, val) => this.handleVendorChange({target:{name:"email",value:val,dataset:{id:idx}}})} freeSolo options={[...new Set(this.state.filteredVendorsContent.map((option) => option.VendorEmailId))]}
                                renderInput={(params) => (
                                  <TextField {...params}  name="email" margin="normal" variant="outlined" />
                                )}
                              />
                              
                              </td>
                              <td>
                                {
                                idx===0?<span></span>
                                : <button className="btn btn-danger" disabled={this.state.preview} onClick={(() => this.clickOnDeleteVendor(data))} ><i className="fa fa-minus" aria-hidden="true"></i></button>
                                }
                              </td>
                            </tr >
                          )
                        })
                      }
                      </tbody>
                      <tfoot>
                          <tr>
                            <td colSpan="4">
                              <button onClick={this.addNewVendorRow} disabled={this.state.preview} type="button" className="btn btn-primary text-center"><i className="fa fa-plus-circle" aria-hidden="true"></i></button>
                          </td></tr>
                      </tfoot>
                  </table>
              </div>
              <div className="card-footer text-center">
                {this.state.preview && <button onClick={this.handleEdit} type="button" className="btn btn-primary btn-danger text-center customButton">Edit</button>} 
                
                {!this.state.preview && <button onClick={this.handlePreview} type="button" className="btn btn-primary text-center customButton">Preview and Submit</button>}

                {this.state.preview && <button onClick={this.handleSubmit} type="button" className="btn btn-primary text-center">Submit</button>}

              </div>
              </div>
              </div>
              </div>
              </Tab>
                 


              <Tab eventKey={2} title="View EnquiryForm">
              <br/>
              <br/>
              <div className="content">
                <select name="EnquiryId" onChange={this.handleViewEditEnquiryForm}>
                  <option value="NA">--select--</option>
                  {this.state.masterEnquiryData.map((data) => <option key={data.Id} value={data.Id}>{data.Name}</option>)}
                  </select>
                <br/>
                <br/>
              </div>
              <div className="row" style={{ marginTop: 20, width: 100 + "%" }}>
              <div className="col-sm-1"></div>
                  {this.state.RData.Id && <div className="col-sm-10">
                    <div className="card">
                      <div className="card-header text-center" style={{ width: 100 + "%"}}>Enquiry Form</div>
                        
                        <div className="card-body">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className="required" >Material</th>
                                        <th className="required" >Description</th>
                                        <th className="required" >Length</th>
                                        <th className="required" >Grade</th>
                                        <th className="required" >Indent</th>
                                        <th className="required" >Make</th>
                                        <th className="required" >Quantity</th>
                                        <th className="required" >Total Weight</th>
                                    </tr>
                                </thead>
                                <tbody >
                                {this.state.RData.Id &&
                                  JSON.parse(this.state.RData.InputJSON).ExcelData.map((data, idx) => {

                                    let Material = `Material-${idx}`, description = `description-${idx}`,dimension=`dimension-${idx}`, length = `length-${idx}`, Grade = `Grade-${idx}`,
                                    Indent = `Indent-${idx}`, Make = `Make-${idx}`, Qty = `Qty-${idx}`, TW = `TW-${idx}`
                                    return (
                                      <tr key={data.SNo}>
                                        <td>
                                          
                                          <Autocomplete id={Material} defaultValue={data.Material} disabled= {true} freeSolo options={[...new Set(this.state.MasterData.MastersteelData.map((option) => option.Name))]}
                                          renderInput={(params) => (
                                            <TextField {...params} name="Material" margin="normal" variant="outlined" value={data.Material}/>
                                          )}
                                        />
                                        </td>
                                        <tr>
                                        <td>
                                        <Autocomplete id={description} defaultValue={data.description} disabled= {true} freeSolo options={[...new Set(this.state.filteredContent.map((option) => option.Dimension1))]}
                                          renderInput={(params) => (
                                            <TextField {...params} name="description" margin="normal" variant="outlined" />
                                          )}
                                        />
                                        
                                        </td>
                                        
                                        <td>
                                        <Autocomplete id={dimension} defaultValue={data.dimension} disabled= {true} freeSolo options={[...new Set(this.state.filteredContent.map((option) => option.Dimension2))]}
                                          renderInput={(params) => (
                                            <TextField {...params} name="dimension" margin="normal" variant="outlined"/>
                                          )}
                                        />
                                        </td>
                                        </tr>
                                        <td>
                                          <input type="text" style={{ width: 100 + "px"}} disabled={true} value={data.length} name="length" data-id={idx} id={length}/>
                                        </td>
                                        <td>
                                          <input type="text" style={{ width: 80 + "px"}} name="Grade"  disabled={true} value={data.Grade} data-id={idx} />
                                        </td>
                                        <td>
                                          <input type="text"  style={{ width: 100 + "px"}} disabled={true} value={data.Indent} name="Indent" data-id={idx} id={Indent}  />
                                        </td>
                                        <td>
                                          <select name="Make" style ={{width:"unset"}} value={data.Make} disabled={true} id={Make} data-id={idx}  >
                                            <option value="NA">--select--</option>
                                            <option value="Jindal">Jindal</option>
                                            <option value="DILL/RSRM">DILL/RSRM</option>
                                            <option value="ROLLED">ROLLED</option>
                                            <option value="SAIL">SAIL</option>
                                          </select>
                                        </td>
                                        <td>
                                          <input type="text" style={{ width: 80 + "px"}} value = {data.Qty} disabled={true} name="Qty" data-id={idx} id={Qty} />
                                        </td>
                                        <td>
                                          <input type="text" style={{ width: 80 + "px"}} value = {data.TW} disabled={true} name="TW" data-id={idx} id={TW} />
                                        </td>
                                      </tr >
                                    )
                                  })
                                }
                                </tbody>
                                
                            </table>
                        </div>
                        
                    </div>
                    
                </div>}
                <div className="col-sm-1"></div>
            </div>
            {this.state.RData.Id && <div className="row" style={{ marginTop: 20, width: 100 + "%" }}>
            <div className="col-sm-1"></div>
            <div className="col-sm-10">
            <div className="card">
            <div className="card-header text-center" style={{ width: 100 + "%"}}>Vendors</div>
              <div className="card-body">
                  <table className="table">
                      <thead>
                          <tr>
                              <th className="required" >Name</th>
                              <th className="required" >Email</th>
                          </tr>
                      </thead>
                      <tbody >
                      {this.state.RData.Id && 
                        JSON.parse(this.state.RData.InputJSON).VendorData.map((data, idx) => {
                          
                          
                          let name = `name-${idx}`, email = `email-${idx}`
                          return (
                            <tr key={data.Id}>
                              <td>
                                
                                <Autocomplete id={name} defaultValue={data.name} disabled={true} freeSolo options={[...new Set(this.state.MasterData.MasterVendors.map((option) => option.VendorName))]}
                                renderInput={(params) => (
                                  <TextField {...params}  name="name" margin="normal" variant="outlined" />
                                )}
                              />
                              </td>
                              
                              <td>
                              <Autocomplete id={email} defaultValue={data.email} disabled={true} freeSolo options={[...new Set(this.state.filteredVendorsContent.map((option) => option.VendorEmailId))]}
                                renderInput={(params) => (
                                  <TextField {...params}  name="email" margin="normal" variant="outlined" />
                                )}
                              />
                              
                              </td>
                              
                            </tr >
                          )
                        })
                      }
                      </tbody>
                      
                  </table>
              </div>
              <div className="card-footer text-center">
              <button onClick={this.handleUseEnquiry} type="button" className="btn btn-primary btn-danger text-center customButton">Use Enquiry</button>

              <button onClick={this.handleDownload} type="button" className="btn btn-primary text-center">Download</button>
                <a href="#" hidden="true" onClick={this.handleDownload}></a>
                <button onClick={this.handleSendMail} type="button" className="btn btn-primary text-center customButton">Send Enquiry</button>
              </div>
              </div>
              </div>
              </div>}
              </Tab>
            </Tabs>
          
              

            <div>
              <Modal
                show={this.state.OpenDialogue}
                onHide={this.handleClose}
                backdrop="static"
                keyboard={false} centered
              >
                <Modal.Header closeButton>
                  <Modal.Title>{this.state.result.status}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {this.state.result.message}
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={this.handleClose}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>

        </div>
        
    )
  }

}

export default EnquiryForm