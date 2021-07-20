import React, {useState, useEffect} from 'react'
import axios from 'axios';
import 'antd/dist/antd.css';
import { Modal, Button } from 'antd'

export const EmployeeTable = () => {
    
    const [employees, setEmployees] = useState([])
    const [managers, setManagers] = useState([])
    const [selectedManager, setSelectedManager] = useState(1)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [employeeFirstName, setEmployeeFirstName] = useState("")
    const [employeeLastName, setEmployeeLastName] = useState("")

    useEffect(() => {
        getAllManagers()
    }, [])

    useEffect(() => {
        getAllEmployeesByManager(selectedManager)
    }, [selectedManager, isModalVisible])
    
    const getAllManagers = () => {
        fetch('http://localhost:3000/api/v1/managements', {
            method: "GET",
        }).then(response => response.json()).then(response => {
            setManagers(response)
        })
    }

    const getAllEmployeesByManager = (managerId) => {
        console.log("getAllEmployeesByManager", managerId)
        fetch('http://localhost:3000/api/v1/allByManager/' + managerId + '/employees', {
            method: 'GET'
        }).then(response => response.json()).then(response => {
            console.log("settingEmployees")
            setEmployees(response)
        })
    }

    const addEmployeeToTable = (managerId) => {
        fetch('http://localhost:3000//api/v1/managements/' + managerId + '/employees', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    firstname: employeeFirstName, 
                    lastname: employeeLastName
                }
            )
        }).then(res => res.json()).then(res => {
            console.log("Employee added!")
        })
    }

    const selectManager = (e) => {
        setSelectedManager(e.target.value)
    }
    
    const displayManagers = () => {
        return(
            <div>
            <select onChange={selectManager}>
                {managers.map((manager) => {
                    return(
                        <option value={manager.id}>{manager.firstname} {manager.lastname}</option>
                    )
                })}
            </select>
            </div>
        )
    }

    const displayEmployees = () => {
        return(
            <table style={{"width":"100%", "border": "1px solid black"}}>
                <tr>
                    <th style={{"border": "1px solid black"}}>Employee Id</th>
                    <th style={{"border": "1px solid black"}}>First Name</th>
                    <th style={{"border": "1px solid black"}}>Last Name</th>
                </tr>
                {employees.map(employee => {
                    return(
                        <tr>
                            <td style={{"border": "1px solid black"}}>{employee.id}</td>
                            <td style={{"border": "1px solid black"}}>{employee.firstname}</td>
                            <td style={{"border": "1px solid black"}}>{employee.lastname}</td>
                        </tr>
                    )
                }
                )}
            </table>
        )
    }

    const modalShowToggle = () => {
        setIsModalVisible(true)
    }

    const handleCancel = () => {
        setIsModalVisible(false)
    }

    const employeeFirst = (e) => {
        setEmployeeFirstName(e.target.value)
    }

    const employeeLast = (e) => {
        setEmployeeLastName(e.target.value)
    }

    const handleSave = () => {
        addEmployeeToTable(selectedManager)
        setIsModalVisible(false)
        setEmployeeFirstName("")
        setEmployeeLastName("")
        getAllEmployeesByManager(selectedManager)
    }

    const modalToggle = () => {
        return (
            <div>
                <Modal title="Add Employee" visible={isModalVisible} onCancel={handleCancel} onOk={handleSave}>
                    <label>Enter Employee First Name</label>
                    <input type="text" placeholder="Enter First Name" onChange={employeeFirst} value={employeeFirstName} />
                    <br />
                    <label>Enter Employee Last Name</label>
                    <input type="text" placeholder="Enter Last Name" onChange={employeeLast} value={employeeLastName} />
                </Modal>
            </div>
        )
    }

    return (
        <>
        <div>
            <h2>Managers</h2>
                {managers.length > 0 ? displayManagers() : null}
            <h2>Employees</h2>
            {console.log("employees", employees.length)}
                {employees.length > 0 ? displayEmployees() : null}
            <br />
            <button onClick={modalShowToggle}>Add Employees</button>
            {modalToggle()}
        </div>
        </>
        )
}



export default EmployeeTable;
