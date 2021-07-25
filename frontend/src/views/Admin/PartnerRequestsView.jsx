import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
    makeStyles,
    Grid,
    Button,
    Card,
    CardHeader,
    CardContent,
    Typography,
    Select,
    MenuItem,
} from "@material-ui/core";
import moment from "moment-timezone";

import AdminService from "../../services/AdminService";

const useStyles = makeStyles((theme) => ({
    root: {
        width: "90vw",

        display: "flex",
        justifyContent: "space-between",
    },
    topContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "stretch",
    },
    botContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: theme.spacing(5),
    },
    button: {
        marginLeft: theme.spacing(1),
    },
    card: {
        height: "100%",
    },
}));

function PartnerRequestsView() {
    const classes = useStyles();

    const [requests, setRequests] = useState([]);
    const [managers, setManagers] = useState([]);
    const [selectedManager, setSelectedManager] = useState({});

    useEffect(async () => {
        const resRequests = await AdminService.getPartnerRequests();
        setRequests(resRequests.data);
        const resManagers = await AdminService.getManagers();
        setManagers(resManagers.data);
        setSelectedManager(resManagers.data[0]);
    }, []);

    const createPartnerManagerMock = async () => {
        AdminService.createPartnerManager(
            "Mr. Manager",
            "MrManager@management.com"
        );
    };

    const rejectApplication = async (application) => {
        await AdminService.rejectApplication(application);
    };

    const approveApplication = async (application, manager) => {
        await AdminService.approveApplication(application, manager);
    };

    return (
        <>
            <Grid container className={classes.root}>
                <Grid item xs={6}>
                    <Card className={classes.card}>
                        <CardHeader
                            title="Managers"
                            action={
                                <>
                                    <Button
                                        onClick={() => {
                                            createPartnerManagerMock();
                                        }}
                                        color="primary"
                                        variant="outlined"
                                    >
                                        Add Manager
                                    </Button>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={selectedManager}
                                        onChange={(e) => {
                                            setSelectedManager(e.target.value);
                                        }}
                                    >
                                        {managers.map((manager, index) => (
                                            <MenuItem
                                                key={`manager-${index}`}
                                                value={manager}
                                            >
                                                {manager.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </>
                            }
                        />
                        <CardContent>
                            {managers.length &&
                                managers.map((manager, index) => (
                                    <Card key={`manager-${index}`}>
                                        <CardContent>
                                            <Typography>
                                                Name: {manager.name}
                                            </Typography>
                                            <Typography>
                                                Email {manager.email}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                ))}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <Card className={classes.card}>
                        <CardHeader title="Requests" />
                        <CardContent>
                            {requests.length &&
                                requests.map((request, index) => (
                                    <Card key={`request-${index}`}>
                                        <CardHeader
                                            title="Request"
                                            action={
                                                <>
                                                    <Button
                                                        onClick={() => {
                                                            approveApplication(
                                                                request,
                                                                selectedManager
                                                            );
                                                        }}
                                                        color="primary"
                                                        variant="outlined"
                                                        className={
                                                            classes.button
                                                        }
                                                    >
                                                        Approve
                                                    </Button>

                                                    <Button
                                                        onClick={() => {
                                                            rejectApplication(
                                                                request
                                                            );
                                                        }}
                                                        variant="outlined"
                                                        className={
                                                            classes.button
                                                        }
                                                    >
                                                        Reject
                                                    </Button>
                                                </>
                                            }
                                        />
                                        <CardContent>
                                            <Typography>
                                                User: {request.user}
                                            </Typography>
                                            <Typography>
                                                Date:{" "}
                                                {moment(request.date)
                                                    .tz("Europe/Berlin")
                                                    .format("DD.MM.YYYY")}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                ))}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
}

PartnerRequestsView.propTypes = {
    history: History,
};

export default connect()(withRouter(PartnerRequestsView));
