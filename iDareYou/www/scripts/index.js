// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in cordova-simulate or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);

        //$.mobile.changePage("#tabPage");

        //CONTROL VARIABLES
        var receivedList = [];
        var createdList = [];
        var approvalMasterObj = {};
        var evidenceMasterObj = {};
        var acceptanceMasterObj = {};

        //TabsPage
        $(document).on('pagebeforeshow', '#tabPage', function () {
            //Sets Received Challenges List
            $.ajax({
                url: "http://idareyou.gear.host/api/challenges/GetReceived?userId=1",
                //dataType: 'jsonp',
                //crossDomain: true,
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("Failed retriving data from the server.");
                },
                success: function (data, textStatus, jqXHR) {
                    receivedList = data;
                    if (receivedList.length > 0) {
                        $('#receivedChallengesList').empty();
                        $.each(receivedList, function (i, item) {
                            var btnHtml = "";
                            switch (item.Status.Id) {
                                case 1:
                                    btnHtml = '<button data-btnType="acceptance" data-index="' + i + '" data-mini="true" data-theme="b">Review</button>';
                                    break;
                                case 2:
                                    btnHtml = '<button data-btnType="evidence" data-index="' + i + '" data-mini="true" data-theme="b">Evidence</button>';
                                    break;
                                case 4:
                                    btnHtml = '<button data-btnType="evidence" data-index="' + i + '" disabled="" data-mini="true" data-theme="b">Evidence</button>';
                                    break;
                            }
                            var liHtml = '<li id="received' + item.Id + '"><div class="ui-grid-a">';
                            liHtml += '<div class="ui-block-a"><div class="ui-grid-a"><div class="ui-grid-solo">';
                            liHtml += '<p>' + item.Title + '</p></div><div class="ui-grid-solo">';
                            liHtml += '<p>' + item.Details + '</p></div></div></div><div class="ui-block-b"><div class="ui-grid-a"><div class="ui-block-a">';
                            liHtml += '<p>' + item.Status.Name + '</p></div><div class="ui-block-b">';
                            liHtml += btnHtml + '</div></div></div></div></li>';
                            $('#receivedChallengesList').append(liHtml);
                            $('#receivedChallengesList').listview('refresh');
                        });
                        $('#receivedChallengesList').enhanceWithin();

                        //ACCEPTANCE BUTTON HANDLER
                        $('[data-btnType="acceptance"]').each(function (i) {
                            $(this).click(function (obj) {
                                var index = $(this).data("index");
                                acceptanceMasterObj = receivedList[index];
                                $.mobile.changePage("#acceptancePage");
                            });
                        });

                        //EVIDENCE BUTTON HANDLER
                        $('[data-btnType="evidence"]').each(function (i) {
                            $(this).click(function (obj) {
                                var index = $(this).data("index");
                                evidenceMasterObj = receivedList[index];
                                $.mobile.changePage("#evidencePage");
                            });
                        });
                    }
                }
            });

            //Sets Created Challenges List
            $.ajax({
                url: "http://idareyou.gear.host/api/challenges/GetCreated?userId=1",
                //dataType: 'jsonp',
                //crossDomain: true,
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("Failed retriving data from the server.");
                },
                success: function (data, textStatus, jqXHR) {
                    createdList = data;
                    if (createdList.length > 0) {
                        $('#createdChallengesList').empty();
                        $.each(createdList, function (i, item) {
                            var btnHtml = "";
                            switch (item.Status.Id) {
                                case 4:
                                    btnHtml = '<button data-btnType="approval" data-index="' + i + '" data-mini="true" data-theme="b">Approval</button>';
                                    break;
                                default:
                                    btnHtml = '<button data-btnType="approval" data-index="' + i + '" disabled="" data-mini="true" data-theme="b">Approval</button>';
                                    break;
                            }
                            var liHtml = '<li id="received' + item.Id + '"><div class="ui-grid-a">';
                            liHtml += '<div class="ui-block-a"><div class="ui-grid-a"><div class="ui-grid-solo">';
                            liHtml += '<p>' + item.Title + '</p></div><div class="ui-grid-solo">';
                            liHtml += '<p>' + item.Details + '</p></div></div></div><div class="ui-block-b"><div class="ui-grid-a"><div class="ui-block-a">';
                            liHtml += '<p>' + item.Status.Name + '</p></div><div class="ui-block-b">';
                            liHtml += btnHtml + '</div></div></div></div></li>';
                            $('#createdChallengesList').append(liHtml);
                            $('#createdChallengesList').listview('refresh');
                        });
                        $('#createdChallengesList').enhanceWithin();

                        //APPROVAL BUTTON HANDLER
                        $('[data-btnType="approval"]').each(function (i) {
                            $(this).click(function (obj) {
                                var index = $(this).data("index");
                                approvalMasterObj = createdList[index];
                                $.mobile.changePage("#approvalPage");
                            });
                        });
                    }
                }
            });
        });

        //NewChallengesPage
        $('#newChallengeBtn').click(function (obj) {
            var challenge = newChallengeModel();
            challenge.Creator.Id = 1;
            challenge.Target.Id = 1;
            challenge.Target.Name = $('#newChallengeFriends').val();
            challenge.Title = $('#newChallengeTitle').val();
            challenge.Details = $('#newChallengeDetails').val();
            $.ajax({
                url: "http://idareyou.gear.host/api/challenges/save",
                type: "POST",
                data: challenge,
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("Failed sending data to the server.");
                },
                success: function (data, textStatus, jqXHR) {
                    alert("Challenge created.");
                    $.mobile.changePage("#tabPage");
                }
            });
        });

        //AcceptancePage
        $(document).on('pagebeforeshow', '#acceptancePage', function () {
            $('#acceptanceTitle').val(acceptanceMasterObj.Title);
            $('#acceptanceDetails').val(acceptanceMasterObj.Details);
            $('#acceptanceFriends').val(acceptanceMasterObj.Target.Name);
            $('#acceptanceSubmitBtn').click(function (obj) {
                $.ajax({
                    url: "http://idareyou.gear.host/api/challenges/AcceptChallenge",
                    type: "POST",
                    data: acceptanceMasterObj,
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert("Failed sending data to the server.");
                    },
                    success: function (data, textStatus, jqXHR) {
                        alert("Its ON!!!");
                        $.mobile.changePage("#tabPage");
                    }
                });
            });
            $('#acceptanceDeclineBtn').click(function (obj) {
                $.ajax({
                    url: "http://idareyou.gear.host/api/challenges/DeclineChallenge",
                    type: "POST",
                    data: acceptanceMasterObj,
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert("Failed sending data to the server.");
                    },
                    success: function (data, textStatus, jqXHR) {
                        alert("That's a shame...");
                        $.mobile.changePage("#tabPage");
                    }
                });
            });
        });

        //EvidencePage
        $(document).on('pagebeforeshow', '#evidencePage', function () {
            $('#evidenceTitle').val(evidenceMasterObj.Title);
            $('#evidenceFriends').val(evidenceMasterObj.Target.Name);
            $('#evidenceSubmitBtn').click(function (obj) {
                evidenceMasterObj.Evidence = {};
                evidenceMasterObj.Evidence.Id = 0;
                evidenceMasterObj.Evidence.Details = $('#evidenceDetails').val();
                $.ajax({
                    url: "http://idareyou.gear.host/api/evidences/SubmitEvidence",
                    type: "POST",
                    data: evidenceMasterObj,
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert("Failed sending data to the server.");
                    },
                    success: function (data, textStatus, jqXHR) {
                        alert("Done!");
                        $.mobile.changePage("#tabPage");
                    }
                });
            });
            $('#evidenceRefuseBtn').click(function (obj) {
                $.ajax({
                    url: "http://idareyou.gear.host/api/challenges/DeclineChallenge",
                    type: "POST",
                    data: evidenceMasterObj,
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert("Failed sending data to the server.");
                    },
                    success: function (data, textStatus, jqXHR) {
                        alert("Too bad, you were almost there...");
                        $.mobile.changePage("#tabPage");
                    }
                });
            });
        });

        //ApprovalPage
        $(document).on('pagebeforeshow', '#approvalPage', function () {
            $('#approvalTitle').val(approvalMasterObj.Title);
            $('#approvalDetails').val(approvalMasterObj.Evidence.Details);
            $('#approvalFriends').val(approvalMasterObj.Target.Name);
            $('#approvalApproveBtn').click(function (obj) {
                $.ajax({
                    url: "http://idareyou.gear.host/api/challenges/ApproveChallenge",
                    type: "POST",
                    data: approvalMasterObj,
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert("Failed sending data to the server.");
                    },
                    success: function (data, textStatus, jqXHR) {
                        alert("Approved.");
                        $.mobile.changePage("#tabPage");
                    }
                });
            });
            $('#approvalRejectBtn').click(function (obj) {
                $.ajax({
                    url: "http://idareyou.gear.host/api/challenges/RejectChallenge",
                    type: "POST",
                    data: approvalMasterObj,
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert("Failed sending data to the server.");
                    },
                    success: function (data, textStatus, jqXHR) {
                        alert("Rejected.");
                        $.mobile.changePage("#tabPage");
                    }
                });
            });
        });
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
})();