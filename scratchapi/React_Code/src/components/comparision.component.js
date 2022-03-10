import React from "react";
import {Modal,Button} from 'react-bootstrap';

class ComparisionForm extends React.Component{
  constructor(props){
    super(props);
    this.sNo = 1;
    this.Id = 1;
    this.state = {
      masterData:[],
      //CSData: [{ SNo: this.sNo, Material: "", description: "",dimension:"", length: "", Grade: "IS: 2062" ,
      // Indent:"", Make:"", Qty:"", TW:""}],
      //VendorsPrice:[{name:"", value:""}]
      CSData:{},
      OpenDialogue:false
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount(){
    fetch('http://localhost:3000/GetAllEnquiryData')
    .then(res => res.json())
          .then((results) => {
            this.setState({
              masterData:results.result.masterData
            })
          })
          .catch((err)=>{
            this.setState({
              masterData:[]
              
            })
            console.log(err.message);
          })
  }
  handleChange=(e)=>{
    let id = parseInt(e.target.value);
    this.setState({
       CSData:JSON.parse(JSON.parse(JSON.stringify(this.state.masterData.filter((enq)=>enq.Id===id)[0])).InputJSON),
      OpenDialogue:true
    });

  }

  handleClose = () => {
    this.setState({
      OpenDialogue:false
    })
  }

/*
  performValidation = () =>{
    let isValid = true;
    this.state.CSData.forEach(element => {
      if(element.Material==="" || element.description==="" || element.dimension==="" || element.length==="" || element.Indent==="" || element.Grade===""||element.Make==="" 
      || element.Make==="NA" ||element.Qty===""||element.TW==="" || element.VendorsPrice=== ""){
        isValid=false;
      }
    });
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
      let excelData1 = this.state.CSData;
      //let vendors = this.state.VendorsPrice;
      //let inputData1 = {ExcelData1:excelData1,VendorsPrice:vendors} //the json file to be send 
      console.log(excelData1);
      fetch("http://localhost:3000/PrepareExcel",
      {
        method:"post",
        body:JSON.stringify(excelData1),
        headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            }
      }).then(res => res.json())
      .then((results)=>{
        if(results.message === "Success")
        {
          this.setState({
            OpenDialogue:true,
            result:{
              status:"Success",
              message:"A new Comparision sheet from with file name "+results.FileName+" is generated."
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
  };
  */
  render(){
    return(
      <div className="content">
        <p>Select an Enquiry to generate a Comparision Sheet</p>
        <select name="EnquiryId" onChange={this.handleChange}>
        <option value="NA">--select--</option>
        {this.state.masterData.map((data) => <option key={data.Id} value={data.Id}>{data.Name}</option>)}
        </select>
        <div >
        {this.state.CSData.ExcelData &&
               <div className="content">
                  <div className="row" style={{ marginTop: 20, width: 100 + "%" }}>
                    <div className="col-sm-1"></div>
                      <div className="col-sm-10">
                        <div className="card">
                          <div className="card-header text-center" style={{ width: 100 + "%"}}>Comparision Sheet</div>
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
                                                                  
                                                {
                                                  this.state.CSData.VendorData.map(post=> {
                                                    return(
                                                      <th className="required" >{post.name}</th>                                     
                                                    )
                                                  })
                                                }
                                          </tr>
                                      </thead>
                                       
                                      <tbody >
                                      
                                      {this.state.CSData.ExcelData &&
                                        this.state.CSData.ExcelData.map((data, idx) => {

                                          let Material = `Material-${idx}`, description = `description-${idx}`,dimension=`dimension-${idx}`, length = `length-${idx}`, Grade = `Grade-${idx}`,
                                          Indent = `Indent-${idx}`, Make = `Make-${idx}`, Qty = `Qty-${idx}`, TW = `TW-${idx}`
                                          return (
                                            <tr key={data.SNo}>
                                              <td>
                                              <input type="text" style={{ width: 100 + "px"}} disabled={true} value={data.Material} name="Material" data-id={idx} id={Material}/>
                                              
                                        
                                              </td>
                                              <tr>
                                              <td>
                                              <input type="text" style={{ width: 100 + "px"}} disabled={true} value={data.description} name="description" data-id={idx} id={description}/>
                                              </td>
                                              <td>
                                              <input type="text" style={{ width: 100 + "px"}} disabled={true} value={data.dimension} name="dimension" data-id={idx} id={dimension}/>
                                              
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
                                              {
                                                  this.state.CSData.VendorData.map(post=> {
                                                    return(
                                                      <td> 
                                                        <input type="text" style={{ width: 80 + "px"}} name="VendorPrice" data-id={idx} id={TW} />

                                                      </td>                                     
                                                    )
                                                  })
                                                }
                                              
                                            </tr >
                                          )
                                        })
                                      }
                                      </tbody>
                                                
                                    </table>
                                    <div className="card-footer text-center"> 
                                      <button onClick={this.handleSubmit} type="button" className="btn btn-primary text-center">Submit</button>
                                    </div>
                              </div>
                          </div>
                        </div>
                    </div>
                  </div> 
  }
        </div>
        </div>
                           
          
    )
  }
}
export default ComparisionForm