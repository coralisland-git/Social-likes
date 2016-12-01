(function () {
    'use strict';

    angular
        .module('app')
        .service('userdata', userdata);

    userdata.$inject = ['$rootScope','votes','editvote','vrowvotes','useraccnt'];

    function userdata($rootScope,votes,editvote,vrowvotes,useraccnt) {

        var service = {

            loadVotes: loadVotes,
        };

        return service;

        function loadVotes() {
            
            var dataLoaded = $rootScope.dataLoaded ? $rootScope.dataLoaded : false;
            
            if ($rootScope.isLoggedIn && !dataLoaded) {
                //load answer votes
                if ($rootScope.cvotes == undefined) {
                    votes.loadVotesByUser().then(function (votetable) {
                        $rootScope.cvotes = votetable;
                    });
                }
                if ($rootScope.editvotes == undefined) {
                    //load edit votes
                    editvote.loadEditVotesTable().then(function (editvotes) {
                        $rootScope.editvotes = editvotes;
                    });
                }
                if ($rootScope.cvrowvotes == undefined) {
                    //Vrow Votes for this user
                    vrowvotes.loadVrowVotes().then(function (vrowvotes) {
                        $rootScope.cvrowvotes = vrowvotes;
                    });
                }
 
                useraccnt.getuseraccnt().then(function (useraccnt){
                    $rootScope.useraccnts = useraccnt;
                    if ($rootScope.useraccnts.length>0){
                        var missingEmail = true;
                        for (var i=0; i<$rootScope.useraccnts.length; i++){
                            if ($rootScope.useraccnts[i].email != '') missingEmail = false;
                        }
                        if (missingEmail) $rootScope.$emit('showWarning');
                    }
                });
                
                $rootScope.dataLoaded = true;
            }
            //console.log("$rootScope.dataLoaded",$rootScope.dataLoaded);
        }

    }
})();