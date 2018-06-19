function newChallengeModel() {
    return {
        Id: 0,
        Creator: newUserModel(),
        CreationDate: "",
        LifeSpan: "",
        Title: "",
        Details: "",
        PictureUrl: "",
        Target: newUserModel(),
        LocationName: "",
        LocationLatitude: "",
        LocationLongitude: "",
        Status: newStatusModel(),
        Evidence: null
    };
};

function newUserModel() {
    return {
        Id: 0,
        UserId: "",
        Name: "",
        Email: "",
        PhotoUrl: ""
    };
};

function newStatusModel() {
    return {
        Id: 0,
        Name: ""
    };
};