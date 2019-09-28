function Bootstrap4ModalDialogManager() {
    this.modals = [];
    this.callbacks = [];
}

Bootstrap4ModalDialogManager.prototype.Unregister = function (dialog) {
    let index = this.modals.indexOf(dialog);
    if (index === -1) return;
    this.modals.splice(index, 1);
    // this.modals = this.modals.filter(function (item) { return item !== dialog });
    if (this.modals.length === 0)
        this.callbacks.forEach(function (currentValue, index, arr) {
            currentValue(false);
        });
}

Bootstrap4ModalDialogManager.prototype.Register = function (dialog) {
    let index = this.modals.indexOf(dialog);
    if (index !== -1) return;
    if (this.modals.length === 0)
        this.callbacks.forEach(function (currentValue, index, arr) {
            currentValue(true);
        });
    this.modals.push(dialog);
}

Bootstrap4ModalDialogManager.prototype.CloseForegroundDialog = function () {
    if (this.modals.length === 0) return;
    let dialog = this.modals[this.modals.length - 1];
    dialog.Hide();
}

Bootstrap4ModalDialogManager.prototype.CloseAllDialogs = function () {
    if (this.modals.length === 0) return;
    this.modals.forEach(function (currentValue, index, arr) {
        currentValue.Hide();
    });
}

Bootstrap4ModalDialogManager.prototype.OnModalChanged = function (callback) {
    if (typeof (callback) === "function")
        this.callbacks.push(callback);
}

var DialogManager = new Bootstrap4ModalDialogManager();

function Bootstrap4ModalDialog(parent, content, title, buttons, type) {
    if (!content) {
        throw "Dialog without content is surely something to be seen!??";
    }
    this.objState = {};
    this.parent = parent;
    var contentType = typeof (content);

    if (contentType === "string")
        this.dialogContent = $("<div>").addClass("modal-body").text(content);
    else if (contentType === "function")
        this.dialogContent = $("<div>").addClass("modal-body").append(content(this));
    else
        this.dialogContent = $("<div>").addClass("modal-body").append(content);
    this.callbacks = [];
    var self = this;
    var dialogStyle = ["bootstrap-dialog", "modal", "fade"];
    type = type || Bootstrap4ModalDialog.Type.Default;
    switch (type || Bootstrap4ModalDialog.Type.Default) {
        case Bootstrap4ModalDialog.Type.Info:
            dialogStyle.push("type-info");
            break;
        case Bootstrap4ModalDialog.Type.Success:
            dialogStyle.push("type-succes");
            break;
        case Bootstrap4ModalDialog.Type.Primary:
            dialogStyle.push("type-primary");
            break;
        case Bootstrap4ModalDialog.Type.Warning:
            dialogStyle.push("type-warning");
            break;
        case Bootstrap4ModalDialog.Type.Danger:
            dialogStyle.push("type-danger");
            break;
        default:
            dialogStyle.push("type-default");
            break;
    }
    if (!buttons) {
        this.dialogButtons = $("<div>").addClass("modal-footer").append(
            $("<button>").addClass("btn btn-primary").attr({ "type": "button", "modal-IsDefault": "true" }).text("OK").click(function (e) {
                self.result = 1;
            })
        );
    } else {
        var buttonsType = typeof (buttons);
        if (buttonsType === "number") {
            switch (buttons) {
                case Bootstrap4ModalDialog.Buttons.Retry:
                    this.dialogButtons = $("<div>").addClass("modal-footer").append(
                        $("<button>").addClass("btn btn-primary").attr({ "type": "button", "modal-IsDefault": "true" }).text("Retry").click(function (e) {
                            self.result = 1;
                        })
                    );
                    break;
                case Bootstrap4ModalDialog.Buttons.OK:
                    this.dialogButtons = $("<div>").addClass("modal-footer").append(
                        $("<button>").addClass("btn btn-primary").attr({ "type": "button", "modal-IsDefault": "true" }).text("OK").click(function (e) {
                            self.result = 1;
                        })
                    );
                    break;
                case Bootstrap4ModalDialog.Buttons.Close:
                    this.dialogButtons = $("<div>").addClass("modal-footer").append(
                        $("<button>").addClass("btn btn-primary").attr({ "type": "button", "modal-IsDefault": "true" }).text("Close").click(function (e) {
                            self.result = 1;
                        })
                    );
                    break;
                case Bootstrap4ModalDialog.Buttons.YesNo:
                    this.dialogButtons = $("<div>").addClass("modal-footer").append(
                        $("<button>").addClass("btn btn-primary").attr({ "type": "button", "modal-IsDefault": "true" }).text("Yes").click(function (e) {
                            self.result = 1;
                        }), [
                            $("<button>").addClass("btn btn-secondary").attr({ "type": "button", "modal-IsCancel": "true", "data-dismiss": "modal" }).text("No")
                        ]
                    );
                    break;
                case Bootstrap4ModalDialog.Buttons.YesNoDanger:
                    this.dialogButtons = $("<div>").addClass("modal-footer").append(
                        $("<button>").addClass("btn btn-danger").attr({ "type": "button", "modal-IsDefault": "true" }).text("Yes").click(function (e) {
                            self.result = 1;
                        }), [
                            $("<button>").addClass("btn btn-primary").attr({ "type": "button", "modal-IsCancel": "true", "data-dismiss": "modal" }).text("No")
                        ]
                    );
                    break;
            }
        } else if (buttonsType === "object" && buttons.length && buttons.length > 0) {
            this.dialogButtons = $("<div>").addClass("modal-footer");
            var btn;
            buttons.forEach(function (current, index, arr) {
                var currentValue = current;
                btn = $("<button>").attr("type", "button");
                if (currentValue.cssClass)
                    btn.addClass(currentValue.cssClass);
                if (currentValue.label)
                    btn.text(currentValue.label);
                if (typeof (currentValue.action) === "function") {
                    btn.click(function (e) {
                        e.stopPropagation();
                        currentValue.action(self);
                    });
                } else {
                    btn.click(function (e) {
                        e.stopPropagation();
                    });
                }
                this.append(btn);
            }, this.dialogButtons);
        }
    }
    if (!title)
        title = "Dialog";
    this.dialogHeader = $("<div>").addClass("modal-header").append(
        $("<h5>").addClass("modal-title").text(title), [
            $("<button>").addClass("close").attr({ "role": "button", "aria-label": "Close", "data-dismiss": "modal" }).append(
                $("<span>").attr("aria-hidden", "true").html("&times;")
            )
        ]
    );
    this.dialog = $("<div>").addClass(dialogStyle).attr({ "tabindex": "-1", "role": "dialog", "aria-labelledby": "ModalLabel", "aria-hidden": "true", "data-backdrop": "false" }).append(
        $("<div>").addClass("modal-dialog modal-dialog-centered").attr("role", "document").append(
            $("<div>").addClass("modal-content").append(
                this.dialogHeader, [this.dialogContent, this.dialogButtons]
            ).click(function (e) {
                if (!e.target)
                    e.stopPropagation();
                else {
                    var element = $(e.target);
                    if (element.is("button") || element.is("a") || element.hasClass("clickable")) { } else {
                        e.stopPropagation();
                    }
                }
            }).draggable({
                handle: ".modal-header",
                containment: parent
            })
        )
    );
}

Bootstrap4ModalDialog.prototype.SetData = function (key, data) {
    this.objState[key] = data;
}

Bootstrap4ModalDialog.prototype.GetData = function (key) {
    return this.objState[key];
}

Bootstrap4ModalDialog.prototype.Show = function (target) {
    var myself = this;
    if (!target) {
        this.parent.append(this.dialog);
    } else {
        target.append(this.dialog);
    }
    this.dialog.on("hidden.bs.modal", function (e) {
        window.DialogManager.Unregister(myself);
        myself.TriggerCallback();
        myself.Dispose();
    });
    this.dialog.on("show.bs.modal", function (e) {
        window.DialogManager.Register(myself);
    });
    this.dialog.modal();
}

Bootstrap4ModalDialog.prototype.RegisterCallback = function (callback) {
    if (typeof (callback) === "function")
        this.callbacks.push(callback);
}

Bootstrap4ModalDialog.prototype.TriggerCallback = function () {
    if (this.callbacks.length === 0) return;
    this.callbacks.forEach(function (currentValue, index, arr) {
        currentValue(this, this.result);
    }, this);
}

Bootstrap4ModalDialog.prototype.Hide = function () {
    this.dialog.modal('hide');
}

// CSHARP!!!!! Joke.
Bootstrap4ModalDialog.prototype.Dispose = function () {
    this.dialog.modal('dispose');
    this.dialog.empty();
    this.dialog.detach();
}

Bootstrap4ModalDialog.Buttons = {
    OK: 0,
    Close: 1,
    YesNo: 2,
    YesNoDanger: 3,
    Retry: 4
};

Bootstrap4ModalDialog.Type = {
    Default: 0,
    Info: 1,
    Primary: 2,
    Success: 3,
    Warning: 4,
    Danger: 5
};