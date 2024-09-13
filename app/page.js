'use client';
import Headers from './pagecomponents/headers'
import Link from "next/link"
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
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import link from 'next/link'
export const description =
  "A login form with email and password. There's an option to login with Google and a link to sign up if you don't have an account."

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();  // Initialize useRouter for navigation



  const login = async () => {
    const url = "http://localhost/contacts/users.php";
    const jsonData = {
      username: username,
      password: password
    }
    var response = await axios.get(url, {
      params: { json: JSON.stringify(jsonData), operation: "login" }

    });


    if (response.data.length > 0) {
      let params = new URLSearchParams();
      params.append('fullname', response.data[0].usr_fullname);
      params.append('userid', response.data[0].usr_id);

      alert("Login Successful");
      router.push(`/main?${params}`);

    }
    else {
      alert("Invalid Username or Password");
    }
  }
  return (
    <>
      <Headers />
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                id="email"
                type="text"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </Link>
              </div>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                type="password"
                required />
            </div>
            <Button onClick={login}>
              Login
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don't have an account?
            <Link href={'/register'} className="underline">
              Register
            </Link>
          </div>
        </CardContent>
      </Card>

    </>
  );
};
