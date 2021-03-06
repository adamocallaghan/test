// Main Route for Todos (Render app content)
FlowRouter.route('/login', {
    action: function() {
        BlazeLayout.render("body", {content: "login"});
    }
});

// Main Route for Todos (Render app content)
FlowRouter.route('/todos', {
    action: function() {
        BlazeLayout.render("body", {content: "content"});
    }
});

// Route for Query page
FlowRouter.route('/query', {
    action: function() {
        BlazeLayout.render("body", {content: "queries"});
    }
});

// Route for Report page
FlowRouter.route('/report', {
    action: function() {
        BlazeLayout.render("body", {content: "report"});
    }
});

// Route for Homepage
FlowRouter.route('/', {
    action: function() {
        BlazeLayout.render("body", {content: "overview"});
    }
});

// Route for Filter
FlowRouter.route('/filter', {
    action: function() {
        BlazeLayout.render("body", {content: "home"});
    }
});

// Route for Trending
FlowRouter.route('/trending', {
    action: function() {
        BlazeLayout.render("body", {content: "trending"});
    }
});

// Route for Archive
FlowRouter.route('/archive', {
    action: function() {
        BlazeLayout.render("body", {content: "archive"});
    }
});