// Main Route for Homepage (Render app content)
FlowRouter.route('/', {
    action: function() {
        BlazeLayout.render("body", {content: "content"});
    }
});

// Route for Profile page
FlowRouter.route('/query', {
    action: function() {
        BlazeLayout.render("body", {content: "query"});
    }
});