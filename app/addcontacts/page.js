'use client';
import Link from "next/link";
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from 'react';
import axios from 'axios';
export const description =
    "A sign up form with first name, last name, email and password inside a card. There's an option to sign up with GitHub and a link to login if you already have an account"

const Addcontacts = () => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [grouplist, setGrouplist] = useState([]);
    const [groupid, setGroupid] = useState("");


    const submit = async () => {
        const url = "http://localhost/contacts/contacts.php";
        const jsonData = [
            {
                groupid: groupid,
                name: name,
                phone: phone,
                email: email,
                address: address,
                userid: sessionStorage.userid
            }
        ];
        const formData = new FormData();
        formData.append("operation", "addContact");
        formData.append("json", JSON.stringify(jsonData));

        const response = await axios({
            url: url,
            method: "POST",
            data: formData,
        });
        console.log(response.data);

        if (response.data == 1) {

            alert("Successfully added");
        } else {
            alert("Adding Failed");
        }

    };

    const getGroups = async () => {
        const url = "http://localhost/contacts/groups.php";

        const response = await axios.get(url, {
            params: { json: "", operation: "getGroups" }
        });

        setGrouplist(response.data);
    };

    useEffect(() => {
        getGroups();
    }, []);



    return (
        <>
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-xl">Add Contact</CardTitle>
                    <CardDescription>
                        Enter information to add contact
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label >Contact Name</Label>
                                <Input placeholder="Max" required />
                            </div>
                            <div className="grid gap-2">
                                <Label >Phone Number</Label>
                                <Input required />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Email Address</Label>
                            <Input

                                type="email"
                                placeholder="m@example.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label >Home Adress</Label>
                            <Input />
                        </div>
                        <div className="grid gap-2">

                            <select
                                value={groupid}
                                onChange={(e) => setGroupid(e.target.value)}

                                className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {/* Replace the options below with your dynamic data */}
                                {grouplist.map((group, index) => {
                                    return (
                                        <option value={group.group_id} key={index}>{group.grp_name}</option>
                                    )
                                })
                                }
                            </select>

                        </div>
                        <Button onClick={submit}>
                            Add to contacts
                        </Button>

                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default Addcontacts
