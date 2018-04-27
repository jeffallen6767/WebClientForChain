
// Example POST method implementation:
/*
postData('http://example.com/answer', {answer: 42})
  .then(data => console.log(data)) // JSON from `response.json()` call
  .catch(error => console.error(error))
*/
/*
function postData(url, data) {
  // Default options are marked with *
  return fetch(url, {
    body: JSON.stringify(data), // must match 'Content-Type' header
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, same-origin, *omit
    headers: {
      'user-agent': 'Mozilla/4.0 MDN Example',
      'content-type': 'application/json'
    },
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, cors, *same-origin
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // *client, no-referrer
  })
  .then(response => response.json()) // parses response to JSON
}
*/
function getUrl(path) {
  var 
    conf = window.CashMoneyConfig.api,
    host = conf.host,
    port = conf.port;
  return host + ":" + port + path;
}

function getPostOptions(data) {
  return {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json'
    }
  };
}

function callCashMoneyApi(path, callback, options) {
  var 
    defaultOptions = {
      redirect: 'follow',
      credentials: 'omit', // include, same-origin, *omit
      mode: 'cors', // no-cors, cors, *same-origin
    },
    allOptions = Object.assign(
      Object.assign(
        {}, 
        defaultOptions
      ), 
      options || {}
    );
    console.log("allOptions", allOptions);
  return fetch(
    getUrl(path),
    allOptions
  )
  .then(res => res.json())
  .then(
    (jsonData) => {
      callback(null, jsonData);
    },
    // Note: it's important to handle errors here
    // instead of a catch() block so that we don't swallow
    // exceptions from actual bugs in components.
    (error) => {
      console.log("then.result.error", error);
      callback(error, null);
    }
  );
}

export const api = {
  "getAccounts": function(callback) {
    return callCashMoneyApi("/loadAccounts", callback);
  },
  "lockAccount": function(account, callback) {
    return callCashMoneyApi("/lockAccount", callback, getPostOptions(account));
  },
  "unlockAccount": function(account, callback) {
    return callCashMoneyApi("/unlockAccount", callback, getPostOptions(account));
  },
  "createAccount": function(account, callback) {
    return callCashMoneyApi("/createAccount", callback, getPostOptions(account));
  }
};


/*
    "subscribe": (topic, user, done) => {
        api.ajax(
            "subscribe",
            api.url(
                "http://$HOST:$PORT/$TOPIC/$USER", 
                "localhost", 
                "8000", 
                topic, 
                user
            ),
            "POST",
            {},
            done
        );
    },
    "unsubscribe": (topic, user, done) => {
        api.ajax(
            "unsubscribe",
            api.url(
                "http://$HOST:$PORT/$TOPIC/$USER", 
                "localhost", 
                "8000", 
                topic, 
                user
            ),
            "DELETE",
            {},
            done
        );
    },
    "publish": (topic, message, done) => {
        api.ajax(
            "publish",
            api.url(
                "http://$HOST:$PORT/$TOPIC", 
                "localhost", 
                "8000", 
                topic, 
                ""
            ),
            "POST",
            {message},
            done
        );
    },
    "retrieve": (topic, user, done) => {
        api.ajax(
            "retrieve",
            api.url(
                "http://$HOST:$PORT/$TOPIC/$USER", 
                "localhost", 
                "8000", 
                topic, 
                user
            ),
            "PATCH",
            {},
            done
        );
    },
    "ajax": (action, url, method, data, next) => {
        const request = $.ajax({
            url: url,
            method: method,
            data: data
        });
        if ($.type(next) === 'function') {
            request.done(function( msg, status, xhr ) {
                next(null, msg, status, xhr);
            });
            request.fail(function( xhr, status, extra ) {
                next(xhr, null, status, extra);
            });
        }
    },
    "url": (template, host, port, topic, user) => {
        return (
            template
                .replace("$HOST", host)
                .replace("$PORT", port)
                .replace("$TOPIC", topic)
                .replace("$USER", user)
        );
    },
    "getMsg": (response) => {
      return (
        decodeURIComponent(
          response.replace("message=", "")
        ).replace(/\+/g, " ")
      );
    },
    "getEl": (selector, next) => {
      return next($(selector));
    },
    "chatbot": {
      "start": (topic) => {
        chatbot.start(api, topic);
      },
      "stop": () => {
        chatbot.stop();
      }
    }
    
    */