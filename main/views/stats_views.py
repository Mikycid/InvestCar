from .. import ws_statistics
from django.http import JsonResponse
from django.contrib.admin.views.decorators import staff_member_required
from django.views.decorators.cache import cache_page

data_stats_admin = ws_statistics.WS_Statistics()

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

@staff_member_required
@cache_page(60*60*24)
def getStatsData(request):
    ips = list(data_stats_admin.connexion_logs["ip"])
    dates = list(data_stats_admin.connexion_logs["date"])
    mean_by_day = data_stats_admin.mean_connexion_by_day()

    return JsonResponse({"ips": ips, "dates": dates, "mean_by_day": mean_by_day})

def incrementVisitor(request):
    data_stats_admin.newVisitor(get_client_ip(request))
    return JsonResponse({})
