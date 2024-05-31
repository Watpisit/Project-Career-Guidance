import { Container, Button, Image } from 'react-bootstrap';
import { React, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import "./User.css";
import Form from 'react-bootstrap/Form';
import UserNavbar from "./UserNavbar"
import Swal from 'sweetalert2';
import axios from 'axios';


export default function UserAssessment() {
    var params = useParams();



    const [assessmentAll, setAssessmentAll] = useState([]);
    const [totalScore1, setTotalScore1] = useState([]);
    const [totalScore2, setTotalScore2] = useState([]);
    const [totalScore3, setTotalScore3] = useState([]);
    const [sumScore1, setSumScore1] = useState(0);
    const [sumScore2, setSumScore2] = useState(0);
    const [sumScore3, setSumScore3] = useState(0);

    const [selectedOptions1, setSelectedOptions1] = useState([]);
    const [selectedOptions2, setSelectedOptions2] = useState([]);
    const [selectedOptions3, setSelectedOptions3] = useState([]);
    const [aptitudeAll, setAptitudeAll] = useState([]);
    const [aptitudeID, setAptitudeID] = useState("");

    const [historyAll, setHistory] = useState([]);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");





    const getAssessment = async () => {
        const response = await fetch(
            "http://localhost:8080/api/get_Assessment",
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    'Content-Type': "application/json"
                }
            }
        );
        const assessment = await response.json();
        setAssessmentAll(assessment.data);
    }

    const getAptitude = async () => {
        const response = await fetch(
            "http://localhost:8080/api/get_aptitude",
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    'Content-Type': "application/json"
                }
            }
        );
        const aptitude = await response.json();
        setAptitudeAll(aptitude.data);
    }

    const getHistory = async () => {
        const response = await fetch(
            "http://localhost:8080/api/get_history",
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    'Content-Type': "application/json"
                }
            }
        );
        const history = await response.json();
        setHistory(history.data);
    }

    useEffect(() => {
        getAssessment();
        getAptitude();
        getHistory();
    }, []);



    const handleSubmit = async () => {
        var totalScore01 = [...totalScore1];
        var totalScore02 = [...totalScore2];
        var totalScore03 = [...totalScore3];  //ถ้าใช้totalScore1.filter เลยจะส่งผลให้ totalScore มีค่าเปลี่ยน
        var countTotalScore1 = totalScore01.filter(score1 => score1 !== undefined && score1 !== "").length;
        var countTotalScore2 = totalScore02.filter(score2 => score2 !== undefined && score2 !== "").length;
        var countTotalScore3 = totalScore03.filter(score3 => score3 !== undefined && score3 !== "").length;

        await totalScore();

        if ((assessmentAll.length === countTotalScore1) && (assessmentAll.length === countTotalScore2) && (assessmentAll.length === countTotalScore3)) {
            if (sumScore1 > sumScore2 && sumScore1 > sumScore3) {
                setAptitudeID("1");
                let newAptitudeID ="1";
 
                // await getCurrentDateTime();
                await addHistory(newAptitudeID);
                // await addAptitudeSheetUser();
                Swal.fire({
                    title: aptitudeAll[0].aptitudeName + '\nคุณได้ ' + sumScore1 + " คะแนน",
                    text: aptitudeAll[0].aptitudeDetails,
                    icon: 'success',
                    confirmButtonText: 'ตกลง'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // นำผู้ใช้ไปยัง URL โดยไม่ให้เกิดการรีโหลด
                        window.location.href = "/user/assessment/" + params.userID;
                    }
                });
            } else if (sumScore2 > sumScore1 && sumScore2 > sumScore3) {
                
               setAptitudeID("2");
               let newAptitudeID ="2";

                // await getCurrentDateTime();
                await addHistory(newAptitudeID);
                // await addAptitudeSheetUser();
                
                Swal.fire({
                    title: aptitudeAll[1].aptitudeName + '\nคุณได้ ' + sumScore2 + " คะแนน",
                    text: aptitudeAll[1].aptitudeDetails,
                    icon: 'success',
                    confirmButtonText: 'ตกลง'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // นำผู้ใช้ไปยัง URL โดยไม่ให้เกิดการรีโหลด
                        window.location.href = "/user/assessment/" + params.userID;
                    }
                });
            } else if (sumScore3 > sumScore1 && sumScore3 > sumScore2) {
                setAptitudeID("3");
                let newAptitudeID ="3";

                // await getCurrentDateTime();
                await addHistory(newAptitudeID);
                // await addAptitudeSheetUser();
                console.log(aptitudeAll[2].aptitudeName + '\nคุณได้ ' + sumScore3 + " คะแนน");
                Swal.fire({
                    title: aptitudeAll[2].aptitudeName + '\nคุณได้ ' + sumScore3 + " คะแนน",
                    text: aptitudeAll[2].aptitudeDetails,
                    icon: 'success',
                    confirmButtonText: 'ตกลง'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                    }
                });
            }

        } else {
            Swal.fire({
                title: 'กรุณาทำแบบประเมินให้ครบทุกข้อ',
                text: 'กรุณากด "ตกลง" เพื่อดำเนินการต่อ',
                icon: 'warning',
                confirmButtonText: 'ตกลง'
            });
        }
    }







    const totalScore = async () => {
        var sum01 = 0;
        var sum02 = 0;
        var sum03 = 0;
        totalScore1.forEach(score1 => {
            if (score1 !== undefined && score1 !== "") {
                sum01 += parseInt(score1, 10);
            }
        });
        setSumScore1(sum01);

        totalScore2.forEach(score2 => {
            if (score2 !== undefined && score2 !== "") {
                sum02 += parseInt(score2, 10);
            }
        });
        setSumScore2(sum02);

        totalScore3.forEach(score3 => {
            if (score3 !== undefined && score3 !== "") {
                sum03 += parseInt(score3, 10);
            }
        });
        setSumScore3(sum03);
        // setSumScore1(sum01);
        // setSumScore2(sum02);
        // setSumScore3(sum03);
    };



    const handleClear = (idx) => {
        const updatedSelectedOptions1 = [...selectedOptions1];
        const updatedSelectedOptions2 = [...selectedOptions2];
        const updatedSelectedOptions3 = [...selectedOptions3];

        // ล้างการเลือกในข้อ 1
        updatedSelectedOptions1[idx] = "";
        setSelectedOptions1(updatedSelectedOptions1);

        // ล้างการเลือกในข้อ 2
        updatedSelectedOptions2[idx] = "";
        setSelectedOptions2(updatedSelectedOptions2);

        // ล้างการเลือกในข้อ 3
        updatedSelectedOptions3[idx] = "";
        setSelectedOptions3(updatedSelectedOptions3);

        // ล้างคะแนน idx mี่ต้องการ
        const updatedTotalScore1 = [...totalScore1];
        const updatedTotalScore2 = [...totalScore2];
        const updatedTotalScore3 = [...totalScore3];

        updatedTotalScore1[idx] = 0;
        updatedTotalScore2[idx] = 0;
        updatedTotalScore3[idx] = 0;

        setTotalScore1(updatedTotalScore1);
        setTotalScore2(updatedTotalScore2);
        setTotalScore3(updatedTotalScore3);

        // เพิ่มการเปลี่ยนสี css สำหรับ radio button ที่ถูกล้าง
        const radioButtons = document.querySelectorAll(`input[name="assessment01${idx}"], input[name="assessment02${idx}"], input[name="assessment03${idx}"]`);
        radioButtons.forEach((radio) => {
            radio.checked = false;
        });
    }




    const currentDate = new Date();
    const addHistory = async (newAptitudeID) => {
      await addAptitudeSheetUser(newAptitudeID);
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString(); // เช่น "18/04/2023"
        const formattedTime = currentDate.toLocaleTimeString(); // เช่น "15:30:00"
    
        const data = {
            historyID: historyAll.length + 1,
            date: formattedDate,
            time: formattedTime,
            dataAptitudeScore: sumScore1,
            toolAptitudeScore: sumScore3,
            personAptitudeScore: sumScore2,
            userID: params.userID,
            aptitudeID: newAptitudeID
        };

        const response = await fetch(
            "http://localhost:8080/add/history",
            {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    data: data
                })
            }
        );
       await response.json();

     //   await axios.put(`http://localhost:8080/add/history`, data);   //ถ้า fetch ต้องใช้ bodyแต่ axios ง่ายกว่า
     
      
    };

    const addAptitudeSheetUser = async (newAptitudeID1) => {
        console.log(aptitudeID)
        const data1 = {
            userID: params.userID,
            aptitudeID: newAptitudeID1
        };
        const response = await fetch(
            "http://localhost:8080/update_aptitude_user",
            {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    data: data1
                })
            }
        );
        
        await response.json();
        //await axios.put(`http://localhost:8080/update_aptitude_user`, data1);
    };









    return (

        <>

            <UserNavbar userID={params.userID} />
            <Container className=' mb-2 ' style={{ marginLeft: '10px' }}>
                <div className='d-flex flex-row align-items-center '>
                    <Image src="https://cdn-icons-png.flaticon.com/128/9746/9746093.png" style={{ width: '20%', marginRight: '4%' }} rounded />
                    <h1 className='mb-2'>แบบประเมินอาชีพ</h1>
                </div>
                <h2 className='mt-2 mb-2'>เส้นทางสู่อาชีพ มีให้เลือกแล้วที่นี่</h2>
                <p>คำชี้แจง: เลือกตัวอักษรที่กำหนดตัวใดตัวหนึ่งโดยต้องไม่ซ้ำกันในแต่ละข้อ ดังต่อไปนี้ </p>
                <p>A หมายถึง ชอบ/ต้องการ</p>
                <p>B หมายถึง คิดดูก่อน/ไม่แน่ใจ</p>
                <p>C หมายถึง ไม่ชอบ/ไม่ต้องการ</p>
            </Container>



            <div className='div-bg-gray'>
                <Container>

                    <Form >
                        {assessmentAll.map((item, idx) => (
                            <div key={item.assessmentID} className='div-bg-white'>
                                {/* {"-------------------------------1.1--------------------------------------------------"} */}
                                <p className='choice'>{idx + 1}. {item.assessmentName}</p>
                                <p>{idx + 1}.1 {item.choice01}</p>
                                <Form.Check
                                    inline
                                    label={"A"}
                                    name={"assessment01" + idx}
                                    type="radio"
                                    id={item.aptitudeID}
                                    onChange={() => {

                                        const updatedSelectedOptions2 = [...selectedOptions2];
                                        const updatedSelectedOptions3 = [...selectedOptions3];

                                        if (updatedSelectedOptions2[idx] !== "A" && updatedSelectedOptions3[idx] !== "A") {
                                            //ถ้าข้อนั้นยังไม่ได้เลือกทีจะเก็บค่า A ไว้ที่ idx นั้นแล้วใหัตัวเลข A ใน 1.2 1.3เป็นจริงทำให้ disable ทำงาน
                                            const updatedTotalScore1 = [...totalScore1]; // คัดลอกอาร์เรย์
                                            updatedTotalScore1[idx] = 2; // กำหนดค่าใหม่ในอินเด็กซ์ที่ต้องการ
                                            setTotalScore1(updatedTotalScore1); // อัปเดตค่าใน state 

                                            const updatedSelectedOptions1 = [...selectedOptions1];
                                            updatedSelectedOptions1[idx] = "A";  //ขเซ็ทข้อที่ผู้ใช้เลือก  เท่ากับ A เพื่อทำให้disable 1.2 1.3เลือก aไม่ได้
                                            setSelectedOptions1(updatedSelectedOptions1)
                                        }

                                    }}
                                    disabled={selectedOptions2[idx] === "A" || selectedOptions3[idx] === "A"}
                                    className='text-content'
                                />
                                <Form.Check
                                    inline
                                    label={"B"}
                                    name={"assessment01" + idx}
                                    type="radio"
                                    id={item.aptitudeID}
                                    onChange={() => {
                                        const updatedSelectedOptions2 = [...selectedOptions2];
                                        const updatedSelectedOptions3 = [...selectedOptions3];

                                        if (updatedSelectedOptions2[idx] !== "B" && updatedSelectedOptions3[idx] !== "B") {
                                            const updatedTotalScore1 = [...totalScore1];
                                            updatedTotalScore1[idx] = 1;
                                            setTotalScore1(updatedTotalScore1);

                                            const updatedSelectedOptions1 = [...selectedOptions1];
                                            updatedSelectedOptions1[idx] = "B";
                                            setSelectedOptions1(updatedSelectedOptions1)
                                        }
                                    }}
                                    disabled={selectedOptions2[idx] === "B" || selectedOptions3[idx] === "B"}
                                    className='text-content'
                                />
                                <Form.Check
                                    inline
                                    label={"C"}
                                    name={"assessment01" + idx}
                                    type="radio"
                                    id={item.aptitudeID}
                                    onChange={() => {
                                        const updatedSelectedOptions2 = [...selectedOptions2];
                                        const updatedSelectedOptions3 = [...selectedOptions3];

                                        if (updatedSelectedOptions2[idx] !== "C" && updatedSelectedOptions3[idx] !== "C") {
                                            const updatedTotalScore1 = [...totalScore1];
                                            updatedTotalScore1[idx] = 0;
                                            setTotalScore1(updatedTotalScore1);

                                            const updatedSelectedOptions1 = [...selectedOptions1];
                                            updatedSelectedOptions1[idx] = "C";
                                            setSelectedOptions1(updatedSelectedOptions1)
                                        }
                                    }}
                                    disabled={selectedOptions2[idx] === "C" || selectedOptions3[idx] === "C"}
                                    className='text-content'
                                />

                                {/* {"-------------------------------1.2--------------------------------------------------"} */}
                                <p>{idx + 1}.2 {item.choice02}</p>
                                <Form.Check
                                    inline
                                    label={"A"}
                                    name={"assessment02" + idx}
                                    type="radio"
                                    id={item.aptitudeID}
                                    onChange={() => {
                                        const updatedSelectedOptions1 = [...selectedOptions1];
                                        const updatedSelectedOptions3 = [...selectedOptions3];

                                        if (updatedSelectedOptions1[idx] !== "A" && updatedSelectedOptions3[idx] !== "A") {
                                            const updatedTotalScore2 = [...totalScore2];
                                            updatedTotalScore2[idx] = 2;
                                            setTotalScore2(updatedTotalScore2);

                                            const updatedSelectedOptions2 = [...selectedOptions2];
                                            updatedSelectedOptions2[idx] = "A";
                                            setSelectedOptions2(updatedSelectedOptions2)
                                        }
                                    }}
                                    disabled={selectedOptions1[idx] === "A" || selectedOptions3[idx] === "A"}
                                    className='text-content'
                                />
                                <Form.Check
                                    inline
                                    label={"B"}
                                    name={"assessment02" + idx}
                                    type="radio"
                                    id={item.aptitudeID}
                                    onChange={() => {
                                        const updatedSelectedOptions1 = [...selectedOptions1];
                                        const updatedSelectedOptions3 = [...selectedOptions3];

                                        if (updatedSelectedOptions1[idx] !== "B" && updatedSelectedOptions3[idx] !== "B") {
                                            const updatedTotalScore2 = [...totalScore2];
                                            updatedTotalScore2[idx] = 1;
                                            setTotalScore2(updatedTotalScore2);

                                            const updatedSelectedOptions2 = [...selectedOptions2];
                                            updatedSelectedOptions2[idx] = "B";
                                            setSelectedOptions2(updatedSelectedOptions2)
                                        }
                                    }}
                                    disabled={selectedOptions1[idx] === "B" || selectedOptions3[idx] === "B"}
                                    className='text-content'
                                />
                                <Form.Check
                                    inline
                                    label={"C"}
                                    name={"assessment02" + idx}
                                    type="radio"
                                    id={item.aptitudeID}
                                    onChange={() => {
                                        const updatedSelectedOptions1 = [...selectedOptions1];
                                        const updatedSelectedOptions3 = [...selectedOptions3];

                                        if (updatedSelectedOptions1[idx] !== "C" && updatedSelectedOptions3[idx] !== "C") {
                                            const updatedTotalScore2 = [...totalScore2];
                                            updatedTotalScore2[idx] = 0;  //อัพเดทคะแนนidxนั้นๆ
                                            setTotalScore2(updatedTotalScore2);

                                            const updatedSelectedOptions2 = [...selectedOptions2];
                                            updatedSelectedOptions2[idx] = "C";  //อัพเดทตัวเลือก A B C idxนั้นๆเพื่อไม่ซ้ำกัน
                                            setSelectedOptions2(updatedSelectedOptions2)
                                        }
                                    }}
                                    disabled={selectedOptions1[idx] === "C" || selectedOptions3[idx] === "C"}
                                    className='text-content'
                                />

                                {/* {"-------------------------------1.3--------------------------------------------------"} */}
                                <p>{idx + 1}.3 {item.choice03}</p>
                                <Form.Check
                                    inline
                                    label={"A"}
                                    name={"assessment03" + idx}
                                    type="radio"
                                    id={item.aptitudeID}
                                    onChange={() => {
                                        const updatedSelectedOptions1 = [...selectedOptions1];
                                        const updatedSelectedOptions2 = [...selectedOptions2];

                                        //Ex. updatedSelectedOptions1-3 = ['A','C','A',n]  = [ข้อที่ 1.1, ข้อที่ 1.2, ข้อที่ 1.3,ข้อที่ n] 
                                        //Ex. updatedTotalScore1-3      = ['2','0','1',n]  = [ข้อที่ 1.1, ข้อที่ 2.1, ข้อที่ 3.1,ข้อที่ n] 
                                        if (updatedSelectedOptions1[idx] !== "A" && updatedSelectedOptions2[idx] !== "A") {
                                            const updatedTotalScore3 = [...totalScore3];
                                            updatedTotalScore3[idx] = 2;  //อัพเดทคะแนนidxนั้นๆ
                                            setTotalScore3(updatedTotalScore3);

                                            const updatedSelectedOptions3 = [...selectedOptions3];
                                            updatedSelectedOptions3[idx] = "A";  //อัพเดทตัวเลือก A B C idxนั้นๆเพื่อไม่ซ้ำกัน
                                            setSelectedOptions3(updatedSelectedOptions3)
                                        }
                                    }}
                                    disabled={selectedOptions1[idx] === "A" || selectedOptions2[idx] === "A"}
                                    className='text-content'
                                />
                                <Form.Check
                                    inline
                                    label={"B"}
                                    name={"assessment03" + idx}
                                    type="radio"
                                    id={item.aptitudeID}
                                    onChange={() => {
                                        const updatedSelectedOptions1 = [...selectedOptions1];
                                        const updatedSelectedOptions2 = [...selectedOptions2];

                                        if (updatedSelectedOptions1[idx] !== "B" && updatedSelectedOptions2[idx] !== "B") {
                                            const updatedTotalScore3 = [...totalScore3];
                                            updatedTotalScore3[idx] = 1;  //อัพเดทคะแนนidxนั้นๆ
                                            setTotalScore3(updatedTotalScore3);

                                            const updatedSelectedOptions3 = [...selectedOptions3];
                                            updatedSelectedOptions3[idx] = "B";  //อัพเดทตัวเลือก A B C idxนั้นๆเพื่อไม่ซ้ำกัน
                                            setSelectedOptions3(updatedSelectedOptions3)
                                        }
                                    }}
                                    disabled={selectedOptions1[idx] === "B" || selectedOptions2[idx] === "B"}
                                    className='text-content'
                                />
                                <Form.Check
                                    inline
                                    label={"C"}
                                    name={"assessment03" + idx}
                                    type="radio"
                                    id={item.aptitudeID}
                                    onChange={() => {
                                        const updatedSelectedOptions1 = [...selectedOptions1];
                                        const updatedSelectedOptions2 = [...selectedOptions2];

                                        if (updatedSelectedOptions1[idx] !== "C" && updatedSelectedOptions2[idx] !== "C") {
                                            const updatedTotalScore3 = [...totalScore3];
                                            updatedTotalScore3[idx] = 0;
                                            setTotalScore3(updatedTotalScore3);

                                            const updatedSelectedOptions3 = [...selectedOptions3];
                                            updatedSelectedOptions3[idx] = "C";
                                            setSelectedOptions3(updatedSelectedOptions3)
                                        }
                                    }}
                                    disabled={selectedOptions1[idx] === "C" || selectedOptions2[idx] === "C"}
                                    className='text-content'
                                />

                                <div className='d-flex flex-column justify-content-center align-items-center w-100 mt-1 mb-2'>
                                    <Button onClick={() => handleClear(idx)}
                                        //  className='d-flex flex-column justify-content-center a w-50' 
                                        variant="danger"
                                    >Clear answer</Button>
                                </div>







                            </div>
                        ))}

                        
                    </Form>
                    <div className='d-flex justify-content-center mt-4 mb-3 '>
                            <Button
                                variant="success"
                                style={{ backgroundColor: 'rgb(22 213 22)' }}
                                onClick={() => {
                                    handleSubmit();
                                }}
                            >
                                ส่งแบบประเมิน
                            </Button>
                        </div>  


                </Container>
            </div>
        </>
    )
}