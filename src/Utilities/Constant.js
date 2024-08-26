let baseDomainChanges = window.location.origin;
if (baseDomainChanges == "http://localhost:3000") {
    module.exports = {
        customer: function () {
            return "https://dev-backend.sriswaminathan.com/rest/V1/swaminathan/"
        },
        baseUrl: function () {
            return "https://dev-backend.sriswaminathan.com/rest/V1/"
        },
        cartUrl: function () {
            return "https://dev-backend.sriswaminathan.com/rest/V1/carts/mine/items"
        },
        homePage: function () {
            return "https://dev-backend.sriswaminathan.com/rest/V1/swaminathan/homepage"
        },
        recaptchaKey: function () {
            return "6Lc73EwmAAAAAEuufh47G-mEumsXEOhISwqwxRxI"
        },
        productUrl: function () {
            return "https://dev-backend.sriswaminathan.com/rest/V1/swaminathan/cmsplppdp/"
        },
        productListUrl: function () {
            return "https://dev-backend.sriswaminathan.com/rest/V1/swaminathan/cmsplppdp/"
        },
        url: "https://dev-backend.sriswaminathan.com/"
    }
}
if (baseDomainChanges == "https://dev-frontend.sriswaminathan.com") {
    module.exports = {
        customer: function () {
            return "https://dev-backend.sriswaminathan.com/rest/V1/swaminathan/"
        },
        baseUrl: function () {
            return "https://dev-backend.sriswaminathan.com/rest/V1/"
        },
        cartUrl: function () {
            return "https://dev-backend.sriswaminathan.com/rest/V1/carts/mine/items"
        },
        homePage: function () {
            return "https://dev-backend.sriswaminathan.com/rest/V1/swaminathan/homepage"
        },
        recaptchaKey: function () {
            return "6LfsJD0nAAAAACXPf28jQprmlz-KhCQ_v9V3MWEw"
        },
        productUrl: function () {
            return "https://dev-backend.sriswaminathan.com/rest/V1/swaminathan/cmsplppdp/"
        },
        productListUrl: function () {
            return "https://dev-backend.sriswaminathan.com/rest/V1/swaminathan/cmsplppdp/"
        },
        url: "https://dev-backend.sriswaminathan.com/"
    }
}
if (baseDomainChanges == "https://b2b.sriswaminathan.com/") {
    module.exports = {
        customer: function () {
            return "https://backend.sriswaminathan.com/rest/V1/swaminathan/"
        },
        baseUrl: function () {
            return "https://backend.sriswaminathan.com/rest/V1/"
        },
        cartUrl: function () {
            return "https://backend.sriswaminathan.com/rest/V1/carts/mine/items"
        },
        homePage: function () {
            return "https://backend.sriswaminathan.com/rest/V1/swaminathan/homepage"
        },
        recaptchaKey: function () {
            return "6LelSgonAAAAAJZfDL5YncWRy4w67zOTnsqCeuP-"
        },
        productUrl: function () {
            return "https://backend.sriswaminathan.com/rest/V1/swaminathan/cmsplppdp/"
        },
        productListUrl: function () {
            return "https://backend.sriswaminathan.com/rest/V1/swaminathan/cmsplppdp/"
        },
        url: "https://backend.sriswaminathan.com/"
    }
}