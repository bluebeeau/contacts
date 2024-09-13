"use client"; // Make sure this is at the very top

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from 'axios';
import Headers from "../pagecomponents/headers";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription
} from "@/components/ui/dialog";
import Link from "next/link"
import { Form, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

const Main = () => {
    const searchParams = useSearchParams();
    const [contactlist, setContactList] = useState([]);
    const [grouplist, setGroupList] = useState([]);
    const [showViewModal, setShowViewModal] = useState(false); // Correctly handle modal state
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const fullname = searchParams.get("fullname");
    const userid = searchParams.get("userid");
    const router = useRouter();

    const [contactId, setContactId] = useState("");
    const [contactName, setContactName] = useState("");
    const [contactAddress, setContactAddress] = useState("");
    const [contactPhone, setContactPhone] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [contactGroup, setContactGroup] = useState("");
    const [contactGroupId, setContactGroupId] = useState("");



    // Contact details
    // const [contactDetails, setContactDetails] = useState({
    //     contact_name: "",
    //     contact_address: "",
    //     contact_phone: "",
    //     contact_email: "",
    //     contactGroup: ""
    // });

    const getGroups = async () => {
        const url = "http://localhost/contacts/groups.php";

        const response = await axios.get(url, {
            params: { json: "", operation: "getGroups" }
        });

        setGroupList(response.data);
    };

    const getContacts = async () => {
        const url = "http://localhost/contacts/contacts.php";
        const jsonData = { userid: userid };

        const response = await axios.get(url, {
            params: { json: JSON.stringify(jsonData), operation: "getContacts" },
        });
        setContactList(response.data);

    };

    const getContactDetails = async (contact_id) => {
        const url = "http://localhost/contacts/contacts.php";
        const jsonData = { contact_id: contact_id };


        const response = await axios.get(url, {
            params: { json: JSON.stringify(jsonData), operation: "getContactDetails" }
        });
        const contact = response.data[0];
        setContactName(contact.contact_name);
        setContactAddress(contact.contact_address);
        setContactPhone(contact.contact_phone);
        setContactEmail(contact.contact_email);
        setContactGroup(contact.grp_name);
        setContactGroupId(contact.contact_group);
        setContactId(contact.contact_id);

    };
    const addContacts = () => {
        sessionStorage.setItem("userid", userid);
        router.push("/addcontacts");
    };
    const showViewModalForm = (contact_id) => {
        getContactDetails(contact_id);
        setShowViewModal(true);
    };
    const showUpdateModalForm = (contact_id) => {
        getContactDetails(contact_id);
        setShowUpdateModal(true);
    };
    const updateContact = async () => {
        const url = "http://localhost/contacts/contacts.php";
        const jsonData = {

            contactId: contactId,
            contactName: contactName,
            contactPhone: contactPhone,
            contactEmail: contactEmail,
            contactAddress: contactAddress,
            contactGroupId: contactGroupId

        };


        const formData = new FormData();
        formData.append("operation", "updateContact");
        formData.append("json", JSON.stringify(jsonData));

        const response = await axios({
            url: url,
            method: "POST",
            data: formData,
        });
        console.log(response.data);

        if (response.data == 1) {
            getContacts();
            alert("Successfully updated contacts");
        } else {
            alert("Update Failed");
        }


    };

    const deleteContact = async () => {
        if (confirm("Are you sure you want to delete this contact?")) {
            const url = "http://localhost/contacts/contacts.php";
            const jsonData = {
                contactId: contactId
            };


            const formData = new FormData();
            formData.append("operation", "deleteContact");
            formData.append("json", JSON.stringify(jsonData));

            const response = await axios({
                url: url,
                method: "POST",
                data: formData,
            });


            if (response.data == 1) {
                getContacts();
                alert("Successfully deleted contacts");
            } else {
                alert("Delete Failed");
            }
        };

    };



    useEffect(() => {
        getContacts();
        getGroups();

    }, []);

    return (
        <>
            <Headers />
            <h1>CONTACTS OF {fullname}</h1>
            <Table>
                <TableCaption>A list of your Contacts {fullname}.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {contactlist.map((contact, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{contact.contact_name}</TableCell>
                            <TableCell>{contact.contact_address}</TableCell>
                            <TableCell>{contact.contact_phone}</TableCell>
                            <TableCell>
                                <Button onClick={() => showViewModalForm(contact.contact_id)}>View</Button>
                                <Button onClick={() => showUpdateModalForm(contact.contact_id)}>Update</Button>
                                <Button onClick={() => { deleteContact(contact.contact_id); }}>Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Button onClick={addContacts}>Add Contacts</Button>

            {/* Properly manage modal state here */}
            <Dialog open={showViewModal} onOpenChange={(isOpen) => setShowViewModal(isOpen)}>
                <DialogContent className="bg-blue sm:max-w-[500px] w-full p-6 rounded-lg shadow-lg z-50">
                    <DialogHeader>
                        <DialogTitle>View contacts of {fullname}</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>{contactName}</TableCell>

                            </TableRow>
                            <TableRow>
                                <TableCell>Address</TableCell>
                                <TableCell>{contactAddress}</TableCell>

                            </TableRow>
                            <TableRow>
                                <TableCell>Phone</TableCell>
                                <TableCell> {contactPhone}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Email</TableCell>
                                <TableCell> {contactEmail}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Group</TableCell>
                                <TableCell>
                                    {contactGroup}
                                </TableCell>
                            </TableRow>

                        </TableBody>
                    </Table>
                    <DialogFooter>
                        <Button onClick={() => setShowViewModal(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>



            <Dialog open={showUpdateModal} onOpenChange={(isOpen) => setShowViewModal(isOpen)}>

                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Update contacts of {fullname}</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>
                                    <input
                                        type="text"
                                        value={contactName}
                                        onChange={(e) => setContactName(e.target.value)}
                                        className="input-class"
                                    />
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell>Address</TableCell>
                                <TableCell>
                                    <input
                                        type="text"
                                        value={contactAddress}
                                        onChange={(e) => setContactAddress(e.target.value)}
                                        className="input-class" // Apply any necessary Tailwind or CSS class
                                    />
                                </TableCell>

                            </TableRow>
                            <TableRow>
                                <TableCell>Phone</TableCell>
                                <TableCell>
                                    <input
                                        type="text"
                                        value={contactPhone}
                                        onChange={(e) => setContactPhone(e.target.value)}
                                        className="input-class"
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Email</TableCell>
                                <TableCell>
                                    <input
                                        type="text"
                                        value={contactEmail}
                                        onChange={(e) => setContactEmail(e.target.value)}
                                        className="input-class" // Apply any necessary Tailwind or CSS class
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Group</TableCell>
                                <TableCell>
                                    <select
                                        value={contactGroupId}
                                        onChange={(e) => setContactGroupId(e.target.value)}
                                        className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {grouplist.map((group, index) => {

                                            return (
                                                <option value={group.grp_id} key={group.grp_id}>
                                                    {group.grp_name}
                                                </option>
                                            )
                                        })}

                                    </select>
                                </TableCell>
                            </TableRow>

                        </TableBody>
                    </Table>
                    <DialogFooter>
                        <Button onClick={() => setShowUpdateModal(false)}>Close</Button>
                        <Button onClick={() => {
                            updateContact();
                            setShowUpdateModal(false)
                        }}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Main
