import React, { useEffect, useState } from "react";
import {
    Button,
    Card,
    CardHeader,
    CardContent,
    Typography,
} from "@material-ui/core";
import moment from "moment-timezone";
import PartnerService from "../../services/PartnerService";

const PartnershipApplicationView = () => {
    const [pendingApplication, setPendingApplication] = useState({});

    useEffect(async () => {
        const res = await PartnerService.getPartnershipApplication();
        const application = res.data;
        if (application && application.length) {
            setPendingApplication(application[0]);
        }
    }, []);

    const createPartnerApplication = async () => {
        const res = await PartnerService.createPartnershipApplication();
        if (res?.success) {
            setPendingApplication(res.data);
        }
    };

    return (
        <>
            {Object.keys(pendingApplication).length > 0 ? (
                <Card>
                    <CardHeader title="Pending Request" />
                    <CardContent>
                        <Typography>User: {pendingApplication.user}</Typography>
                        <Typography>
                            Date:{" "}
                            {moment(pendingApplication.date)
                                .tz("Europe/Berlin")
                                .format("DD.MM.YYYY")}
                        </Typography>
                    </CardContent>
                </Card>
            ) : (
                <Button
                    variant="outlined"
                    onClick={() => createPartnerApplication()}
                >
                    Apply for Partnership
                </Button>
            )}
        </>
    );
};

export default PartnershipApplicationView;
