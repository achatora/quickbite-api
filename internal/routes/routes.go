package routes

import (
	"github.com/labstack/echo/v4"
	"github.com/siralfredthegreat/quickbite-api/internal/handlers"
	"github.com/siralfredthegreat/quickbite-api/internal/middleware"
)

// SetupRoutes takes the Echo server engine and maps out all our URLs
func SetupRoutes(e *echo.Echo) {

	// PUBLIC GROUP: PUBLIC
	e.POST("/register", handlers.HandleCreateUser)   // Register user account
	e.POST("/login", handlers.HandleUserLogin)       // Login user account
	e.GET("/", handlers.HandleHome)                  // Home Base Route
	e.GET("/menu", handlers.HandleGetMenu)           // Menu Route (Read-Only)
	e.GET("/health_check", handlers.HandleGetHealth) // Check Server and DB Health

	// PRIVATE GROUP: PROTECTED HANDLERS
	protected := e.Group("")
	protected.Use(middleware.AuthMiddleware)

	protected.POST("/orders", handlers.HandleCreateOrder)       // Orders Routes (Read) ADMIN USER
	protected.GET("/orders/:id", handlers.HandleGetOrderStatus) // Get order status
	protected.DELETE("/orders/:id", handlers.HandleDeleteOrder) // Delete or Cancel Order
	protected.GET("/profile", handlers.HandleUserProfile)

	// PRIVATE ADMIN GROUP: ADMIN ROLE
	admin := e.Group("")
	admin.Use(middleware.AuthMiddleware)
	admin.Use(middleware.AdminMiddleware)

	admin.POST("/menu", handlers.HandleCreateMenuItem)                     // Add Menu Items
	admin.PATCH("/menu/:id/availability", handlers.HandleAvailabilityMenu) // Update menu availability
	admin.PATCH("/orders/:id/status", handlers.HandleUpdateOrderStatus)    // Update Order Status
	admin.GET("/orders", handlers.HandleGetOrders)                         // Orders Routes (Read) ADMIN USER
}
