from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


# Register your models here.

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    """Custom User Admin that handles email as username"""
    fieldsets = UserAdmin.fieldsets + (
        ('Social Media Management', {'fields': ('is_social_manager',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2'),
        }),
    )
    list_display = ('email', 'username', 'first_name', 'last_name', 'is_staff', 'is_social_manager')
    search_fields = ('email', 'username', 'first_name', 'last_name')
    ordering = ('email',)



