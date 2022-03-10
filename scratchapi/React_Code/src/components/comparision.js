import React from "react";
var masterSteelData = [];
 var vendordata = {

	"Vendors":"Vendor1,Vendor2,Vendor3"
}

class Comparision extends React.Component {
    constructor(props)
  {
    
    super(props);
    this.sNo = 1;
    this.state = {
      SteelData: [{ SNo: this.sNo, Material: "", description: "", length: "", Grade: "" ,
       Indent:"", Make:"", Qty:"", TW:"", V1:"",V2:"",V3: ""}],
    }
    this.handleChange=this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getMasterSteelData = this.getMasterSteelData.bind(this);
    this.getMasterSteelData();
   
    
  }

  getMasterSteelData()
  {
    fetch('http://localhost:3000/GetSteelData')
    .then(res => res.json())
          .then((results) => {
            masterSteelData = results.result;
          });
  }

  handleChange = (e) => {
      if (["Material", "description", "length", "Grade", "Indent", "Make", "Qty", "TW","Price"].includes(e.target.name)) {
          let SteelData = [...this.state.SteelData]
          SteelData[e.target.dataset.id][e.target.name] = e.target.value;
      } else {
          this.setState({ [e.target.name]: e.target.value })
      }
      
  }

  handleSubmit = () => {
      console.log(JSON.stringify(this.state.SteelData));
      var parsedJSON = JSON.parse(JSON.stringify(masterSteelData));
        
      }
  



render() {
    return (
        <div className="content">
                <div className="row" style={{ marginTop: 20, width: 100 + "%" }}>
                    <div className="col-sm-1"></div>
                    <div className="col-sm-10">
                        <div className="card">
                            <div className="card-header text-center" style={{ width: 100 + "%"}}>Vendor 1</div>
                            <br/><br/>
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
                                            <th className="required" >V1</th>
                                            <th className="required" >V2</th>
                                            <th className="required" >V3</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                      this.state.SteelData.map((data, idx) => {
                                        let Material = `Material-${idx}`, description = `description-${idx}`, length = `length-${idx}`, Grade = `Grade-${idx}`,
                                        Indent = `Indent-${idx}`, Make = `Make-${idx}`, Qty = `Qty-${idx}`, TW = `TW-${idx}`
                                        return (
                                          <tr key={data.SNo}>
                                            <td>
                                              <input type="text"  name="Material" data-id={idx} id={Material} className="form-control " onChange={this.handleChange}/>
                                            </td>
                                            <td>
                                              <input type="text"  name="description" data-id={idx} id={description} className="form-control "  onChange={this.handleChange}/>
                                            </td>
                                            <td>
                                              <input type="text"  name="length" data-id={idx} id={length} className="form-control "  onChange={this.handleChange}/>
                                            </td>
                                            <td>
                                              <input type="text"  name="Grade" data-id={idx} id={Grade} className="form-control "  onChange={this.handleChange}/>
                                            </td>
                                            <td>
                                              <input type="text"  name="Indent" data-id={idx} id={Indent} className="form-control "  onChange={this.handleChange}/>
                                            </td>
                                            <td>
                                              <select name="Make" id={Make} data-id={idx} className="form-control"  onChange={this.handleChange}>
                                                <option value="Jindal">Jindal</option>
                                                <option value="DILL/RSRM">DILL/RSRM</option>
                                                <option value="ROLLED">ROLLED</option>
                                                <option value="SAIL">SAIL</option>
                                              </select>
                                            </td>
                                            <td>
                                              <input type="text"  name="Qty" data-id={idx} id={Qty} className="form-control "  onChange={this.handleChange}/>
                                            </td>
                                            <td>
                                              <input type="text"  name="TW" data-id={idx} id={TW} className="form-control "  onChange={this.handleChange}/>
                                            </td>
                                            <td>
                                              <input type="interger"  name="V1" data-id={idx} id={TW} className="form-control "  onChange={this.handleChange}/>
                                            </td>
                                            <td>
                                              <input type="interger"  name="V2" data-id={idx} id={TW} className="form-control "  onChange={this.handleChange}/>
                                            </td>
                                            <td>
                                              <input type="interger"  name="V3" data-id={idx} id={TW} className="form-control "  onChange={this.handleChange}/>
                                            </td>
                                          </tr >
                                        )
                                      })
                                    }
                                    </tbody>
                
                                </table>
                            </div>
                            <div className="card-footer text-center"> <button onClick={this.handleSubmit} type="button" className="btn btn-primary text-center">Submit</button></div>
                        </div>
                    </div>
                    <div className="col-sm-1"></div>
                </div>
        </div>
    )}
}

export default Comparision