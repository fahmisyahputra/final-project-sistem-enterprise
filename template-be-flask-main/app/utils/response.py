"""
Response Helpers
================
Helper untuk membuat response yang konsisten
"""

from flask import jsonify


def success_response(data=None, message="Success", status_code=200):
    """Create success response"""
    response = {
        'success': True,
        'message': message
    }
    if data is not None:
        response['data'] = data
    return jsonify(response), status_code


def error_response(message="Error", status_code=400, errors=None):
    """Create error response"""
    response = {
        'success': False,
        'message': message
    }
    if errors:
        response['errors'] = errors
    return jsonify(response), status_code


def paginated_response(items, total, page, per_page, message="Success"):
    """Create paginated response"""
    total_pages = (total + per_page - 1) // per_page
    return jsonify({
        'success': True,
        'message': message,
        'data': items,
        'meta': {
            'total': total,
            'page': page,
            'per_page': per_page,
            'total_pages': total_pages
        }
    }), 200
