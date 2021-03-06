        hljs.registerLanguage("scala", function(e) {
    var t= {
        cN: "meta", b: "@[A-Za-z]+"
    }
    , a= {
        cN:"subst", v:[ {
            b: "\\$[A-Za-z0-9_]+"
        }
        , {
            b:"\\${", e: "}"
        }
        ]
    }
    , r= {
        cN:"string", v:[ {
            b: '"', e: '"', i: "\\n", c: [e.BE]
        }
        , {
            b: '"""', e: '"""', r: 10
        }
        , {
            b: '[a-z]+"', e: '"', i: "\\n", c: [e.BE, a]
        }
        , {
            cN: "string", b: '[a-z]+"""', e: '"""', c: [a], r: 10
        }
        ]
    }
    , c= {
        cN: "symbol", b: "'\\w[\\w\\d_]*(?!')"
    }
    , i= {
        cN: "type", b: "\\b[A-Z][A-Za-z0-9_]*", r: 0
    }
    , s= {
        cN:"title", b:/[^0-9\n\t "'(),.`{}\[\]:;][^\n\t "'(),.`{}\[\]:;]+|[^0-9\n\t "'(), .` {}
        \[\]: ;
        =]/, r: 0
    }
    , n= {
        cN:"class", bK:"class object trait type", e:/[:= {
            \[\n;
            ]/, eE:!0, c:[ {
                bK: "extends with", r: 10
            }
            , {
                b: /\[/, e: /\]/, eB: !0, eE: !0, r: 0, c: [i]
            }
            , {
                cN: "params", b: /\(/, e: /\)/, eB: !0, eE: !0, r: 0, c: [i]
            }
            , s]
        }
        , l= {
            cN:"function", bK:"def", e:/[:= {
                \[(\n;
                ]/, eE: !0, c: [s]
            }
            ;
            return {
                k: {
                    literal: "true false null", keyword: "type yield lazy override def with val var sealed abstract private trait object if forSome for while throw finally protected extends import final return else break new catch super class case package default try this match continue throws implicit"
                }
                , c:[e.CLCM, e.CBCM, r, c, i, l, n, e.CNM, t]
            }
        }
        );
