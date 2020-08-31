
function expectEqual(a, b) {
    var type = typeof a;
    expect(type).toBe(typeof b);

    if (a === null) {
        expect(b === null).toBeTruthy();
    }
    else {
        switch (type) {
            case 'boolean':
            case 'string':
            case 'number':
                expect(b === a).toBeTruthy();
                break;

            case 'undefined':
                expect(b == null).toBeTruthy();
                break;

            case 'object':
                for (var i in a) {
                    if (a.hasOwnProperty(i) && a[i] != null) {
                        expect(b.hasOwnProperty(i)).toBeTruthy();
                    }
                }
            
                for (var i in b) {
                    if (b.hasOwnProperty(i) && b[i] != null) {
                        expect(a.hasOwnProperty(i)).toBeTruthy();
                    }
                }
            
                for (var i in a) {
                    expectEqual(a[i], b[i]);
                }
                break;

            default:
                if (a instanceof Array) {
                    expect(b instanceof Array).toBeTruthy();
                    expect(a.length).toBe(b.length);

                    if (b instanceof Array && a.length === b.length) {
                        for (var i = 0; i < a.length; i++) {
                            expectEqual(a[i], b[i]);
                        }
                    }
                }
        }
    }
}

describe("Unpack ANode", function () {

        it("array", function () {
            var packed = [1,"div",2,2,"id",3,"test",38,16,6,17,4,1,17,5,1,18,6,1,3,"c",17,10,43,4,2,4,1,17,6,1,3,"d",18,6,1,3,"e",];
            var aNode = {"directives":{"if":{"value":{"type":12,"items":[{"expr":{"type":2,"value":1}},{"expr":{"type":3,"value":true}},{"spread":true,"expr":{"type":4,"paths":[{"type":1,"value":"c"}]}},{"expr":{"type":8,"operator":43,"segs":[{"type":2,"value":2},{"type":2,"value":1}]}},{"expr":{"type":4,"paths":[{"type":1,"value":"d"}]}},{"spread":true,"expr":{"type":4,"paths":[{"type":1,"value":"e"}]}}]}}},"props":[{"name":"id","expr":{"type":1,"value":"test"}}],"events":[],"children":[],"tagName":"div"};

            expectEqual(san.unpackANode(packed), aNode);
    
        });
        
        it("binary", function () {
            var packed = [1,"div",2,2,"id",3,"test",38,10,45,10,43,4,2,4,3,4,4,];
            var aNode = {"directives":{"if":{"value":{"type":8,"operator":45,"segs":[{"type":8,"operator":43,"segs":[{"type":2,"value":2},{"type":2,"value":3}]},{"type":2,"value":4}]}}},"props":[{"name":"id","expr":{"type":1,"value":"test"}}],"events":[],"children":[],"tagName":"div"};

            expectEqual(san.unpackANode(packed), aNode);
    
        });
        
        it("bool-false", function () {
            var packed = [1,"div",2,2,"id",3,"test",38,5,,];
            var aNode = {"directives":{"if":{"value":{"type":3,"value":false}}},"props":[{"name":"id","expr":{"type":1,"value":"test"}}],"events":[],"children":[],"tagName":"div"};

            expectEqual(san.unpackANode(packed), aNode);
    
        });
        
        it("bool", function () {
            var packed = [1,"div",2,2,"id",3,"test",38,5,1,];
            var aNode = {"directives":{"if":{"value":{"type":3,"value":true}}},"props":[{"name":"id","expr":{"type":1,"value":"test"}}],"events":[],"children":[],"tagName":"div"};

            expectEqual(san.unpackANode(packed), aNode);
    
        });
        
        it("children", function () {
            var packed = [1,"ul",3,,3,"\n",1,"li",4,37,"i",,,6,1,3,"l",1,"label",1,,3,"title",1,"input",1,2,"type",3,"checkbox",,3,"\n",,3,"\n"];
            var aNode = {"directives":{},"props":[],"events":[],"children":[{"textExpr":{"type":1,"value":"\n"}},{"directives":{"for":{"item":"i","value":{"type":4,"paths":[{"type":1,"value":"l"}]}}},"props":[],"events":[],"children":[{"directives":{},"props":[],"events":[],"children":[{"textExpr":{"type":1,"value":"title"}}],"tagName":"label"},{"directives":{},"props":[{"name":"type","expr":{"type":1,"value":"checkbox"}}],"events":[],"children":[],"tagName":"input"},{"textExpr":{"type":1,"value":"\n"}}],"tagName":"li"},{"textExpr":{"type":1,"value":"\n"}}],"tagName":"ul"};

            expectEqual(san.unpackANode(packed), aNode);
    
        });
        
        it("composite", function () {
            var packed = [1,"div",4,2,"class",3,"editor-page",,3,"\n  ",1,"div",4,2,"class",3,"container page",,3,"\n    ",1,"div",4,2,"class",3,"row",,3,"\n      ",1,"div",6,2,"class",3,"col-md-10 offset-md-1 col-xs-12",,3,"\n        ",1,"x-errors",,,3,"\n        ",1,"form",6,35,"submit",8,6,1,3,"onPublish",1,6,1,3,"$event",1,"prevent",,3,"\n          ",1,"fieldset",10,2,"disabled",6,1,3,"inProgress",,3,"\n            ",1,"fieldset",4,2,"class",3,"form-group",,3,"\n              ",1,"input",4,2,"type",3,"text",2,"class",3,"form-control form-control-lg",34,"value",6,2,3,"article",3,"title",2,"placeholder",3,"Article Title",,3,"\n            ",,3,"\n            ",1,"fieldset",4,2,"class",3,"form-group",,3,"\n              ",1,"input",4,2,"type",3,"text",2,"class",3,"form-control",34,"value",6,2,3,"article",3,"description",2,"placeholder",3,"What's this article about?",,3,"\n            ",,3,"\n            ",1,"fieldset",4,2,"class",3,"form-group",,3,"\n              ",1,"textarea",5,2,"class",3,"form-control",2,"rows",3,"8",34,"value",6,2,3,"article",3,"body",2,"placeholder",3,"Write your article (in markdown)",,3,"\n              ",,3,"\n            ",,3,"\n            ",1,"fieldset",6,2,"class",3,"form-group",,3,"\n              ",1,"input",5,2,"type",3,"text",2,"class",3,"form-control",2,"placeholder",3,"Enter tags",34,"value",6,1,3,"tagInput",35,"keypress",8,6,1,3,"addTag",1,6,1,3,"$event",,,3,"\n              ",1,"div",4,2,"class",3,"tag-list",,3,"\n                ",1,"span",5,2,"class",3,"tag-default tag-pill",37,"tag",,,6,2,3,"article",3,"tagList",,3,"\n                  ",1,"i",2,2,"class",3,"ion-close-round",35,"click",8,6,1,3,"removeTag",1,6,1,3,"tag",,,9,,3,3,"\n                  ",7,,6,1,3,"tag",,3,"\n                ",,3,"\n              ",,3,"\n            ",,3,"\n          ",,3,"\n          ",1,"button",3,2,"disabled",6,1,3,"inProgress",2,"class",3,"btn btn-lg pull-xs-right btn-primary",,3,"\n            Publish Article\n          ",,3,"\n        ",,3,"\n      ",,3,"\n    ",,3,"\n  ",,3,"\n"];
            var aNode = {"directives":{},"props":[{"name":"class","expr":{"type":1,"value":"editor-page"}}],"events":[],"children":[{"textExpr":{"type":1,"value":"\n  "}},{"directives":{},"props":[{"name":"class","expr":{"type":1,"value":"container page"}}],"events":[],"children":[{"textExpr":{"type":1,"value":"\n    "}},{"directives":{},"props":[{"name":"class","expr":{"type":1,"value":"row"}}],"events":[],"children":[{"textExpr":{"type":1,"value":"\n      "}},{"directives":{},"props":[{"name":"class","expr":{"type":1,"value":"col-md-10 offset-md-1 col-xs-12"}}],"events":[],"children":[{"textExpr":{"type":1,"value":"\n        "}},{"directives":{},"props":[],"events":[],"children":[],"tagName":"x-errors"},{"textExpr":{"type":1,"value":"\n        "}},{"directives":{},"props":[],"events":[{"name":"submit","modifier":{"prevent":true},"expr":{"type":6,"name":{"type":4,"paths":[{"type":1,"value":"onPublish"}]},"args":[{"type":4,"paths":[{"type":1,"value":"$event"}]}]}}],"children":[{"textExpr":{"type":1,"value":"\n          "}},{"directives":{},"props":[{"name":"disabled","expr":{"type":4,"paths":[{"type":1,"value":"inProgress"}]}}],"events":[],"children":[{"textExpr":{"type":1,"value":"\n            "}},{"directives":{},"props":[{"name":"class","expr":{"type":1,"value":"form-group"}}],"events":[],"children":[{"textExpr":{"type":1,"value":"\n              "}},{"directives":{},"props":[{"name":"type","expr":{"type":1,"value":"text"}},{"name":"class","expr":{"type":1,"value":"form-control form-control-lg"}},{"name":"value","expr":{"type":4,"paths":[{"type":1,"value":"article"},{"type":1,"value":"title"}]},"x":1},{"name":"placeholder","expr":{"type":1,"value":"Article Title"}}],"events":[],"children":[],"tagName":"input"},{"textExpr":{"type":1,"value":"\n            "}}],"tagName":"fieldset"},{"textExpr":{"type":1,"value":"\n            "}},{"directives":{},"props":[{"name":"class","expr":{"type":1,"value":"form-group"}}],"events":[],"children":[{"textExpr":{"type":1,"value":"\n              "}},{"directives":{},"props":[{"name":"type","expr":{"type":1,"value":"text"}},{"name":"class","expr":{"type":1,"value":"form-control"}},{"name":"value","expr":{"type":4,"paths":[{"type":1,"value":"article"},{"type":1,"value":"description"}]},"x":1},{"name":"placeholder","expr":{"type":1,"value":"What's this article about?"}}],"events":[],"children":[],"tagName":"input"},{"textExpr":{"type":1,"value":"\n            "}}],"tagName":"fieldset"},{"textExpr":{"type":1,"value":"\n            "}},{"directives":{},"props":[{"name":"class","expr":{"type":1,"value":"form-group"}}],"events":[],"children":[{"textExpr":{"type":1,"value":"\n              "}},{"directives":{},"props":[{"name":"class","expr":{"type":1,"value":"form-control"}},{"name":"rows","expr":{"type":1,"value":"8"}},{"name":"value","expr":{"type":4,"paths":[{"type":1,"value":"article"},{"type":1,"value":"body"}]},"x":1},{"name":"placeholder","expr":{"type":1,"value":"Write your article (in markdown)"}}],"events":[],"children":[{"textExpr":{"type":1,"value":"\n              "}}],"tagName":"textarea"},{"textExpr":{"type":1,"value":"\n            "}}],"tagName":"fieldset"},{"textExpr":{"type":1,"value":"\n            "}},{"directives":{},"props":[{"name":"class","expr":{"type":1,"value":"form-group"}}],"events":[],"children":[{"textExpr":{"type":1,"value":"\n              "}},{"directives":{},"props":[{"name":"type","expr":{"type":1,"value":"text"}},{"name":"class","expr":{"type":1,"value":"form-control"}},{"name":"placeholder","expr":{"type":1,"value":"Enter tags"}},{"name":"value","expr":{"type":4,"paths":[{"type":1,"value":"tagInput"}]},"x":1}],"events":[{"name":"keypress","modifier":{},"expr":{"type":6,"name":{"type":4,"paths":[{"type":1,"value":"addTag"}]},"args":[{"type":4,"paths":[{"type":1,"value":"$event"}]}]}}],"children":[],"tagName":"input"},{"textExpr":{"type":1,"value":"\n              "}},{"directives":{},"props":[{"name":"class","expr":{"type":1,"value":"tag-list"}}],"events":[],"children":[{"textExpr":{"type":1,"value":"\n                "}},{"directives":{"for":{"item":"tag","value":{"type":4,"paths":[{"type":1,"value":"article"},{"type":1,"value":"tagList"}]}}},"props":[{"name":"class","expr":{"type":1,"value":"tag-default tag-pill"}}],"events":[],"children":[{"textExpr":{"type":1,"value":"\n                  "}},{"directives":{},"props":[{"name":"class","expr":{"type":1,"value":"ion-close-round"}}],"events":[{"name":"click","modifier":{},"expr":{"type":6,"name":{"type":4,"paths":[{"type":1,"value":"removeTag"}]},"args":[{"type":4,"paths":[{"type":1,"value":"tag"}]}]}}],"children":[],"tagName":"i"},{"textExpr":{"type":7,"segs":[{"type":1,"value":"\n                  "},{"type":5,"expr":{"type":4,"paths":[{"type":1,"value":"tag"}]},"filters":[]},{"type":1,"value":"\n                "}]}}],"tagName":"span"},{"textExpr":{"type":1,"value":"\n              "}}],"tagName":"div"},{"textExpr":{"type":1,"value":"\n            "}}],"tagName":"fieldset"},{"textExpr":{"type":1,"value":"\n          "}}],"tagName":"fieldset"},{"textExpr":{"type":1,"value":"\n          "}},{"directives":{},"props":[{"name":"disabled","expr":{"type":4,"paths":[{"type":1,"value":"inProgress"}]}},{"name":"class","expr":{"type":1,"value":"btn btn-lg pull-xs-right btn-primary"}}],"events":[],"children":[{"textExpr":{"type":1,"value":"\n            Publish Article\n          "}}],"tagName":"button"},{"textExpr":{"type":1,"value":"\n        "}}],"tagName":"form"},{"textExpr":{"type":1,"value":"\n      "}}],"tagName":"div"},{"textExpr":{"type":1,"value":"\n    "}}],"tagName":"div"},{"textExpr":{"type":1,"value":"\n  "}}],"tagName":"div"},{"textExpr":{"type":1,"value":"\n"}}],"tagName":"div"};

            expectEqual(san.unpackANode(packed), aNode);
    
        });
        
        it("directive", function () {
            var packed = [1,"div",5,42,6,2,3,"a",6,1,3,"b",41,3,"p1",43,6,1,3,"html",44,8,6,1,3,"tran",,36,"name",6,2,3,"p",3,"name"];
            var aNode = {"directives":{"bind":{"value":{"type":4,"paths":[{"type":1,"value":"a"},{"type":4,"paths":[{"type":1,"value":"b"}]}]}},"ref":{"value":{"type":1,"value":"p1"}},"html":{"value":{"type":4,"paths":[{"type":1,"value":"html"}]}},"transition":{"value":{"type":6,"name":{"type":4,"paths":[{"type":1,"value":"tran"}]},"args":[]}}},"props":[],"events":[],"children":[],"tagName":"div","vars":[{"name":"name","expr":{"type":4,"paths":[{"type":1,"value":"p"},{"type":1,"value":"name"}]}}]};

            expectEqual(san.unpackANode(packed), aNode);
    
        });
        
        it("elem-attr-children", function () {
            var packed = [1,"div",3,2,"id",3,"test",2,"title",9,,3,3,"Hello ",7,,6,1,3,"name",,3,"!",,9,,3,3,"Hello ",7,,6,1,3,"name",,3,"!"];
            var aNode = {"directives":{},"props":[{"name":"id","expr":{"type":1,"value":"test"}},{"name":"title","expr":{"type":7,"segs":[{"type":1,"value":"Hello "},{"type":5,"expr":{"type":4,"paths":[{"type":1,"value":"name"}]},"filters":[]},{"type":1,"value":"!"}]}}],"events":[],"children":[{"textExpr":{"type":7,"segs":[{"type":1,"value":"Hello "},{"type":5,"expr":{"type":4,"paths":[{"type":1,"value":"name"}]},"filters":[]},{"type":1,"value":"!"}]}}],"tagName":"div"};

            expectEqual(san.unpackANode(packed), aNode);
    
        });
        
        it("elem-attr", function () {
            var packed = [1,"div",2,2,"id",3,"test",2,"title",3,"san"];
            var aNode = {"directives":{},"props":[{"name":"id","expr":{"type":1,"value":"test"}},{"name":"title","expr":{"type":1,"value":"san"}}],"events":[],"children":[],"tagName":"div"};

            expectEqual(san.unpackANode(packed), aNode);
    
        });
        
        it("elem", function () {
            var packed = [1,"x-root",];
            var aNode = {"directives":{},"props":[],"events":[],"children":[],"tagName":"x-root"};

            expectEqual(san.unpackANode(packed), aNode);
    
        });
        
        it("event-call-complex", function () {
            var packed = [1,"div",2,35,"click",8,6,1,3,"clicker",1,6,1,3,"$event",,35,"tap",8,6,2,3,"methods",6,1,3,"name",3,6,1,3,"a",6,2,3,"obj",6,1,3,"b",3,"test",];
            var aNode = {"directives":{},"props":[],"events":[{"name":"click","modifier":{},"expr":{"type":6,"name":{"type":4,"paths":[{"type":1,"value":"clicker"}]},"args":[{"type":4,"paths":[{"type":1,"value":"$event"}]}]}},{"name":"tap","modifier":{},"expr":{"type":6,"name":{"type":4,"paths":[{"type":1,"value":"methods"},{"type":4,"paths":[{"type":1,"value":"name"}]}]},"args":[{"type":4,"paths":[{"type":1,"value":"a"}]},{"type":4,"paths":[{"type":1,"value":"obj"},{"type":4,"paths":[{"type":1,"value":"b"}]}]},{"type":1,"value":"test"}]}}],"children":[],"tagName":"div"};

            expectEqual(san.unpackANode(packed), aNode);
    
        });
        
        it("event", function () {
            var packed = [1,"div",1,35,"click",8,6,1,3,"clicker",1,6,1,3,"$event",];
            var aNode = {"directives":{},"props":[],"events":[{"name":"click","modifier":{},"expr":{"type":6,"name":{"type":4,"paths":[{"type":1,"value":"clicker"}]},"args":[{"type":4,"paths":[{"type":1,"value":"$event"}]}]}}],"children":[],"tagName":"div"};

            expectEqual(san.unpackANode(packed), aNode);
    
        });
        
        it("for", function () {
            var packed = [1,"ul",2,37,"i",,,6,1,3,"l",1,"li",1,37,"i2",,"i2.id",6,1,3,"l2"];
            var aNode = {"directives":{"for":{"item":"i","value":{"type":4,"paths":[{"type":1,"value":"l"}]}}},"props":[],"events":[],"children":[{"directives":{"for":{"item":"i2","value":{"type":4,"paths":[{"type":1,"value":"l2"}]},"trackBy":{"type":4,"paths":[{"type":1,"value":"i2"},{"type":1,"value":"id"}]},"trackByRaw":"i2.id"}},"props":[],"events":[],"children":[],"tagName":"li"}],"tagName":"ul"};

            expectEqual(san.unpackANode(packed), aNode);
    
        });
        
        it("if-else", function () {
            var packed = [1,"div",3,,3,"\n",1,"nav",2,38,6,1,3,"a",1,"a",2,,3,"aa",1,"b",1,,3,"bb",1,1,"u",2,40,,3,"bb",,3,"\n"];
            var aNode = {"directives":{},"props":[],"events":[],"children":[{"textExpr":{"type":1,"value":"\n"}},{"directives":{"if":{"value":{"type":4,"paths":[{"type":1,"value":"a"}]}}},"props":[],"events":[],"children":[{"directives":{},"props":[],"events":[],"children":[{"textExpr":{"type":1,"value":"aa"}},{"directives":{},"props":[],"events":[],"children":[{"textExpr":{"type":1,"value":"bb"}}],"tagName":"b"}],"tagName":"a"}],"tagName":"nav","elses":[{"directives":{"else":{"value":{}}},"props":[],"events":[],"children":[{"textExpr":{"type":1,"value":"bb"}}],"tagName":"u"}]},{"textExpr":{"type":1,"value":"\n"}}],"tagName":"div"};

            expectEqual(san.unpackANode(packed), aNode);
    
        });
        
        it("if-only", function () {
            var packed = [1,"div",3,,3,"\n",1,"nav",2,38,6,1,3,"a",1,"a",2,,3,"aa",1,"b",1,,3,"bb",,,3,"\n"];
            var aNode = {"directives":{},"props":[],"events":[],"children":[{"textExpr":{"type":1,"value":"\n"}},{"directives":{"if":{"value":{"type":4,"paths":[{"type":1,"value":"a"}]}}},"props":[],"events":[],"children":[{"directives":{},"props":[],"events":[],"children":[{"textExpr":{"type":1,"value":"aa"}},{"directives":{},"props":[],"events":[],"children":[{"textExpr":{"type":1,"value":"bb"}}],"tagName":"b"}],"tagName":"a"}],"tagName":"nav"},{"textExpr":{"type":1,"value":"\n"}}],"tagName":"div"};

            expectEqual(san.unpackANode(packed), aNode);
    
        });
        
        it("if", function () {
            var packed = [1,"div",3,,3,"\n",1,"nav",2,38,6,1,3,"a",1,"a",2,,3,"aa",1,"b",1,,3,"bb",3,1,"ul",1,39,6,1,3,"b",1,"div",4,39,6,1,3,"c",,3,"\n  ",1,"a",5,,3,"aa\n    ",1,"b",1,,3,"bb",,3,"\n    ",1,"span",3,,3,"text",1,"del",1,,3,"bb",,3,"tex2",,3,"\n  ",,3,"\n",1,"u",2,40,,3,"bb",,3,"\n"];
            var aNode = {"directives":{},"props":[],"events":[],"children":[{"textExpr":{"type":1,"value":"\n"}},{"directives":{"if":{"value":{"type":4,"paths":[{"type":1,"value":"a"}]}}},"props":[],"events":[],"children":[{"directives":{},"props":[],"events":[],"children":[{"textExpr":{"type":1,"value":"aa"}},{"directives":{},"props":[],"events":[],"children":[{"textExpr":{"type":1,"value":"bb"}}],"tagName":"b"}],"tagName":"a"}],"tagName":"nav","elses":[{"directives":{"elif":{"value":{"type":4,"paths":[{"type":1,"value":"b"}]}}},"props":[],"events":[],"children":[],"tagName":"ul"},{"directives":{"elif":{"value":{"type":4,"paths":[{"type":1,"value":"c"}]}}},"props":[],"events":[],"children":[{"textExpr":{"type":1,"value":"\n  "}},{"directives":{},"props":[],"events":[],"children":[{"textExpr":{"type":1,"value":"aa\n    "}},{"directives":{},"props":[],"events":[],"children":[{"textExpr":{"type":1,"value":"bb"}}],"tagName":"b"},{"textExpr":{"type":1,"value":"\n    "}},{"directives":{},"props":[],"events":[],"children":[{"textExpr":{"type":1,"value":"text"}},{"directives":{},"props":[],"events":[],"children":[{"textExpr":{"type":1,"value":"bb"}}],"tagName":"del"},{"textExpr":{"type":1,"value":"tex2"}}],"tagName":"span"},{"textExpr":{"type":1,"value":"\n  "}}],"tagName":"a"},{"textExpr":{"type":1,"value":"\n"}}],"tagName":"div"},{"directives":{"else":{"value":{}}},"props":[],"events":[],"children":[{"textExpr":{"type":1,"value":"bb"}}],"tagName":"u"}]},{"textExpr":{"type":1,"value":"\n"}}],"tagName":"div"};

            expectEqual(san.unpackANode(packed), aNode);
    
        });
        
        it("num", function () {
            var packed = [1,"div",2,2,"id",3,"test",38,4,37,];
            var aNode = {"directives":{"if":{"value":{"type":2,"value":37}}},"props":[{"name":"id","expr":{"type":1,"value":"test"}}],"events":[],"children":[],"tagName":"div"};

            expectEqual(san.unpackANode(packed), aNode);
    
        });
        
        it("object", function () {
            var packed = [1,"div",2,2,"id",3,"test",38,13,6,14,3,"a",4,1,14,3,"b",5,1,15,6,1,3,"c",14,3,"f",10,43,4,2,4,1,14,3,"d",6,1,3,"d",15,6,1,3,"e",];
            var aNode = {"directives":{"if":{"value":{"type":11,"items":[{"name":{"type":1,"value":"a"},"expr":{"type":2,"value":1}},{"name":{"type":1,"value":"b"},"expr":{"type":3,"value":true}},{"spread":true,"expr":{"type":4,"paths":[{"type":1,"value":"c"}]}},{"name":{"type":1,"value":"f"},"expr":{"type":8,"operator":43,"segs":[{"type":2,"value":2},{"type":2,"value":1}]}},{"name":{"type":1,"value":"d"},"expr":{"type":4,"paths":[{"type":1,"value":"d"}]}},{"spread":true,"expr":{"type":4,"paths":[{"type":1,"value":"e"}]}}]}}},"props":[{"name":"id","expr":{"type":1,"value":"test"}}],"events":[],"children":[],"tagName":"div"};

            expectEqual(san.unpackANode(packed), aNode);
    
        });
        
        it("prop", function () {
            var packed = [1,"input",3,2,"type",3,"checkbox",34,"value",6,1,3,"val",33,"checked",5,1];
            var aNode = {"directives":{},"props":[{"name":"type","expr":{"type":1,"value":"checkbox"}},{"name":"value","expr":{"type":4,"paths":[{"type":1,"value":"val"}]},"x":1},{"name":"checked","expr":{"type":3,"value":true},"noValue":1}],"events":[],"children":[],"tagName":"input"};

            expectEqual(san.unpackANode(packed), aNode);
    
        });
        
        it("text-expr-interp", function () {
            var packed = [,6,1,3,"name",];
            var aNode = {"textExpr":{"type":4,"paths":[{"type":1,"value":"name"}]}};

            expectEqual(san.unpackANode(packed), aNode);
    
        });
        
        it("text-expr", function () {
            var packed = [,9,,3,3,"Hello ",7,,6,1,3,"name",,3,"!"];
            var aNode = {"textExpr":{"type":7,"segs":[{"type":1,"value":"Hello "},{"type":5,"expr":{"type":4,"paths":[{"type":1,"value":"name"}]},"filters":[]},{"type":1,"value":"!"}]}};

            expectEqual(san.unpackANode(packed), aNode);
    
        });
        
        it("text-node", function () {
            var packed = [,3,"Hello San"];
            var aNode = {"textExpr":{"type":1,"value":"Hello San"}};

            expectEqual(san.unpackANode(packed), aNode);
    
        });
        
        it("unary", function () {
            var packed = [1,"div",2,2,"id",3,"test",38,11,33,6,1,3,"a",];
            var aNode = {"directives":{"if":{"value":{"type":9,"expr":{"type":4,"paths":[{"type":1,"value":"a"}]},"operator":33}}},"props":[{"name":"id","expr":{"type":1,"value":"test"}}],"events":[],"children":[],"tagName":"div"};

            expectEqual(san.unpackANode(packed), aNode);
    
        });
        

});