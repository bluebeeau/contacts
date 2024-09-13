'use client';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from 'react';
import axios from 'axios';
import Headers from "../pagecomponents/headers";
import { Button } from "@/components/ui/button";

const Register = () => {
    const [fullname, setFullname] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    const submit = async () => {
        const url = "http://localhost/contacts/users.php";
        const jsonData =
        {
            fullname: fullname,
            username: username,
            password: password
        }

        const formData = new FormData();
        formData.append("operation", "save");
        formData.append("json", JSON.stringify(jsonData));

        const response = await axios({
            url: url,
            method: "POST",
            data: formData,
        });

        if (response.data == 1) {
            alert("Sign Up Successful");
        } else if (response.data == 0) {
            alert("Sign Up Failed");
        }
    };

    return (
        <div>
            <Headers />
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-xl">Register Here</CardTitle>
                    <CardDescription>
                        Enter your information to create an account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">

                        <div className="grid gap-2">
                            <Label htmlFor="fullname">Fullname</Label>
                            <Input
                                onChange={(e) => setFullname(e.target.value)}
                                id="fullname"
                                placeholder="Max"
                                required />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                type="text"
                                onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <Button onClick={submit}>Sign Up</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Register;
