var HomeView = function () {
  this.initialize = function () {
      // Define a div wrapper for the view (used to attach events)
      this.$el = $('<div/>');
      this.render();
  };

  this.render = function() {
    var input = {
      buttons: [
        {
          icon_classes: "fa-flag",
          label: "Problem",
          href: "#problem"
        },
        {
          icon_classes: "fa-flag",
          label: "Usage Map",
          href: "#usage-map"
        },
        {
          icon_classes: "fa-flag",
          label: "All Reports",
          href: "#all-report"
        },
        {
          icon_classes: "fa-flag",
          label: "Improvement",
          href: "#improvement"
        },
        {
          icon_classes: "fa-flag",
          label: "Collisions/Near Misses",
          href: "#collisions"
        },
        {
          icon_classes: "fa-flag",
          label: "Profile",
          href: "#profile"
        },
      ]
    };

    this.$el.html(this.template(input));
    return this;
  };

  this.initialize();
}

