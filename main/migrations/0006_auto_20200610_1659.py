# Generated by Django 3.0.5 on 2020-06-10 16:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0005_auto_20200610_1424'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='vues',
            field=models.TextField(default='\\{\\}'),
        ),
    ]