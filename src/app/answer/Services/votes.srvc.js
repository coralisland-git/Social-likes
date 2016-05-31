(function () {
    'use strict';

    angular
        .module('app')
        .factory('votes', votes);

    votes.$inject = ['$http', '$q', '$rootScope'];

    function votes($http, $q, $rootScope) {

        // Members
        var _votes = [];
        var baseURI = '/api/v2/mysql';

        var service = {
            loadVotesTable: loadVotesTable,
            patchRec: patchRec,
			postRec: postRec,
            deleteVotesbyAnswer: deleteVotesbyAnswer
			
            //    addTable: addTable
        };

        return service;


        function loadVotesTable(forceRefresh) {
      
             if (_isVotesLoaded() && !forceRefresh) {

                return $q.when(_votes);
            }
            
           //Get all vote records for current user
            var url = baseURI + '/_table/votetable/?filter=user='+ $rootScope.user.id;
             
            return $http.get(url).then(querySucceeded, _queryFailed);
            
            function querySucceeded(result) {

                return _votes = result.data.resource;
            }
                 
        }
		
        function postRec(table_id,answer_id, vote) {
            
            //form match record
            var obj = {};
            obj.resource = [];
                     
            var data={};
            data.user = $rootScope.user.id;
            data.answer = answer_id;
            data.category = $rootScope.cCategory.id;
            data.vote = vote;
            data.timestmp = Date.now(); 
            
            obj.resource.push(data); 
            
            var url = baseURI + '/_table/votetable'; 
            
            return $http.post(url, obj, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                body: obj
            }).then(querySucceeded, _queryFailed);
            function querySucceeded(result) {
                
                //update local copies
                var datax = data;
                datax.id = result.data.resource[0].id; 
                _votes.push(datax);
                
                $rootScope.cvotes.push(datax);
                
                console.log("Creating new voting record was succesful");
                return result.data;
            }
        }
        
        function patchRec(rec_id,vote) {
            
            //form match record
            var obj = {};
            obj.resource = [];
            
           
            var data={};
            data.id = rec_id;
            data.vote = vote;
            data.timestmp = Date.now(); 
            
            obj.resource.push(data); 
            
            var url = baseURI + '/_table/votetable'; 
            
             //update local record of votes
            var i = _votes.map(function(x) {return x.id; }).indexOf(rec_id);
            _votes[i].vote = vote;
            _votes[i].timestmp = data.timestmp;
            
            return $http.patch(url, obj, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                body: obj
            }).then(querySucceeded, _queryFailed);
            function querySucceeded(result) {

                console.log("Updating vote record was succesful");
                return result.data;
            }
        }
        function deleteVotesbyAnswer(answer_id) {
            
            //delete records from local copy
            for (var i=0; i<_votes.length;i++){
                if (_votes[i].answer == answer_id){
                    _votes.splice(i,1);
                } 
            }
            
           var url = baseURI + '/_table/votetable?filter=answer=' + answer_id; 
            
            return $http.delete(url).then(querySucceeded, _queryFailed);
            v
            function querySucceeded(result) {

                console.log("Deleting vote records was succesful");
                return result.data;
            }
        }
        
        function _isVotesLoaded(id) {

            return _votes.length > 0;
        }
        function _queryFailed(error) {

            throw error;
        }

    }
})();